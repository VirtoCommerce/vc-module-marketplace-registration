using System;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using VirtoCommerce.MarketplaceRegistrationModule.Core;
using VirtoCommerce.MarketplaceRegistrationModule.Core.Services;
using VirtoCommerce.MarketplaceRegistrationModule.Data.Handlers;
using VirtoCommerce.MarketplaceRegistrationModule.Data.MySql;
using VirtoCommerce.MarketplaceRegistrationModule.Data.PostgreSql;
using VirtoCommerce.MarketplaceRegistrationModule.Data.Repositories;
using VirtoCommerce.MarketplaceRegistrationModule.Data.Services;
using VirtoCommerce.MarketplaceRegistrationModule.Data.SqlServer;
using VirtoCommerce.MarketplaceVendorModule.StateMachine.Models;
using VirtoCommerce.Platform.Core.Events;
using VirtoCommerce.Platform.Core.Modularity;
using VirtoCommerce.Platform.Core.Security;
using VirtoCommerce.Platform.Core.Settings;
using VirtoCommerce.Platform.Data.MySql.Extensions;
using VirtoCommerce.Platform.Data.PostgreSql.Extensions;
using VirtoCommerce.Platform.Data.SqlServer.Extensions;

namespace VirtoCommerce.MarketplaceRegistrationModule.Web;

public class Module : IModule, IHasConfiguration
{
    public ManifestModuleInfo ModuleInfo { get; set; }
    public IConfiguration Configuration { get; set; }

    public void Initialize(IServiceCollection serviceCollection)
    {
        serviceCollection.AddDbContext<RegistrationDbContext>(options =>
        {
            var databaseProvider = Configuration.GetValue("DatabaseProvider", "SqlServer");
            var connectionString = Configuration.GetConnectionString(ModuleInfo.Id) ?? Configuration.GetConnectionString("VirtoCommerce");

            switch (databaseProvider)
            {
                case "MySql":
                    options.UseMySqlDatabase(connectionString, typeof(MySqlDataAssemblyMarker), Configuration);
                    break;
                case "PostgreSql":
                    options.UsePostgreSqlDatabase(connectionString, typeof(PostgreSqlDataAssemblyMarker), Configuration);
                    break;
                default:
                    options.UseSqlServerDatabase(connectionString, typeof(SqlServerDataAssemblyMarker), Configuration);
                    break;
            }
        });

        serviceCollection.AddTransient<IRegistrationRepository, RegistrationRepository>();
        serviceCollection.AddTransient<Func<IRegistrationRepository>>(provider => () => provider.CreateScope().ServiceProvider.GetRequiredService<IRegistrationRepository>());

        serviceCollection.AddTransient<StateMachineTriggerEventHandler>();

        serviceCollection.AddTransient<IRegistrationRequestService, RegistrationRequestService>();
        serviceCollection.AddTransient<IRegistrationRequestCrudService, RegistrationRequestCrudService>();
        serviceCollection.AddTransient<IRegistrationRequestSearchService, RegistrationRequestSearchService>();

        serviceCollection.AddMediatR(typeof(Data.Anchor));
    }

    public void PostInitialize(IApplicationBuilder appBuilder)
    {
        var serviceProvider = appBuilder.ApplicationServices;

        // Register event handlers
        appBuilder.RegisterEventHandler<StateMachineTriggerEvent, StateMachineTriggerEventHandler>();

        // Register settings
        var settingsRegistrar = serviceProvider.GetRequiredService<ISettingsRegistrar>();
        settingsRegistrar.RegisterSettings(ModuleConstants.Settings.AllSettings, ModuleInfo.Id);

        // Register permissions
        var permissionsRegistrar = serviceProvider.GetRequiredService<IPermissionsRegistrar>();
        permissionsRegistrar.RegisterPermissions(ModuleInfo.Id, "MarketplaceRegistrationModule", ModuleConstants.Security.Permissions.AllPermissions);

        // Apply migrations
        using var serviceScope = serviceProvider.CreateScope();
        using var dbContext = serviceScope.ServiceProvider.GetRequiredService<RegistrationDbContext>();
        dbContext.Database.Migrate();
    }

    public void Uninstall()
    {
        // Nothing to do here
    }
}
