using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using VirtoCommerce.MarketplaceRegistrationModule.Core;
using VirtoCommerce.MarketplaceRegistrationModule.Core.Services;
using VirtoCommerce.MarketplaceRegistrationModule.Data;
using VirtoCommerce.MarketplaceRegistrationModule.Data.ExportImport;
using VirtoCommerce.MarketplaceRegistrationModule.Data.Handlers;
using VirtoCommerce.MarketplaceRegistrationModule.Data.MySql;
using VirtoCommerce.MarketplaceRegistrationModule.Data.PostgreSql;
using VirtoCommerce.MarketplaceRegistrationModule.Data.Repositories;
using VirtoCommerce.MarketplaceRegistrationModule.Data.Services;
using VirtoCommerce.MarketplaceRegistrationModule.Data.SqlServer;
using VirtoCommerce.MarketplaceRegistrationModule.Data.Validators;
using VirtoCommerce.MarketplaceRegistrationModule.Web.Authorization;
using VirtoCommerce.Platform.Core.Common;
using VirtoCommerce.Platform.Core.Events;
using VirtoCommerce.Platform.Core.ExportImport;
using VirtoCommerce.Platform.Core.Modularity;
using VirtoCommerce.Platform.Core.Settings;
using VirtoCommerce.Platform.Data.MySql.Extensions;
using VirtoCommerce.Platform.Data.PostgreSql.Extensions;
using VirtoCommerce.Platform.Data.SqlServer.Extensions;
using VirtoCommerce.StateMachineModule.Core.Events;

namespace VirtoCommerce.MarketplaceRegistrationModule.Web;

public class Module : IModule, IHasConfiguration, IExportSupport, IImportSupport
{
    private IApplicationBuilder _appBuilder;

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

        serviceCollection.AddTransient<RegistrationRequestValidatorBase, RegistrationRequestValidator>();

        serviceCollection.AddTransient<IRegistrationRequestService, RegistrationRequestService>();
        serviceCollection.AddTransient<IRegistrationRequestCrudService, RegistrationRequestCrudService>();
        serviceCollection.AddTransient<IRegistrationRequestSearchService, RegistrationRequestSearchService>();

        serviceCollection.AddTransient<RegistrationExportImport>();

        serviceCollection.AddMediatR(configuration => configuration.RegisterServicesFromAssemblyContaining<Anchor>());
    }

    public void PostInitialize(IApplicationBuilder appBuilder)
    {
        _appBuilder = appBuilder;

        var serviceProvider = appBuilder.ApplicationServices;

        // Register event handlers
        appBuilder.RegisterEventHandler<StateMachineTriggerEvent, StateMachineTriggerEventHandler>();

        // Register settings
        var settingsRegistrar = serviceProvider.GetRequiredService<ISettingsRegistrar>();
        settingsRegistrar.RegisterSettings(ModuleConstants.Settings.AllSettings, ModuleInfo.Id);

        //Register module authorization
        appBuilder.UseModuleAuthorization();

        // Apply migrations
        using var serviceScope = serviceProvider.CreateScope();
        using var dbContext = serviceScope.ServiceProvider.GetRequiredService<RegistrationDbContext>();
        dbContext.Database.Migrate();
    }

    public void Uninstall()
    {
        // Nothing to do here
    }

    public Task ExportAsync(Stream outStream, ExportImportOptions options, Action<ExportImportProgressInfo> progressCallback,
        ICancellationToken cancellationToken)
    {
        return _appBuilder.ApplicationServices.GetRequiredService<RegistrationExportImport>().DoExportAsync(outStream, options,
            progressCallback, cancellationToken);
    }

    public Task ImportAsync(Stream inputStream, ExportImportOptions options, Action<ExportImportProgressInfo> progressCallback,
        ICancellationToken cancellationToken)
    {
        return _appBuilder.ApplicationServices.GetRequiredService<RegistrationExportImport>().DoImportAsync(inputStream, options,
            progressCallback, cancellationToken);
    }

}
