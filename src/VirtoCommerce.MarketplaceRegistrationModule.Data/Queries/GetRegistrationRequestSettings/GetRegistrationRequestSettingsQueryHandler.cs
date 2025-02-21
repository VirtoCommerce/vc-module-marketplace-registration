using System.Threading;
using System.Threading.Tasks;
using VirtoCommerce.MarketplaceRegistrationModule.Core;
using VirtoCommerce.MarketplaceRegistrationModule.Core.Models;
using VirtoCommerce.MarketplaceVendorModule.Core.Common;
using VirtoCommerce.Platform.Core.Settings;

namespace VirtoCommerce.MarketplaceRegistrationModule.Data.Queries;
public class GetRegistrationRequestSettingsQueryHandler : IQueryHandler<GetRegistrationRequestSettingsQuery, RegistrationRequestSettings>
{
    private readonly ISettingsManager _settingsManager;

    public GetRegistrationRequestSettingsQueryHandler(
        ISettingsManager settingsManager
        )
    {
        _settingsManager = settingsManager;
    }

    public virtual Task<RegistrationRequestSettings> Handle(GetRegistrationRequestSettingsQuery request, CancellationToken cancellationToken)
    {
        var registrationRequestSettings = ExType<RegistrationRequestSettings>.New();

        registrationRequestSettings.RegistrationFormUrl = _settingsManager.GetValue<string>(ModuleConstants.Settings.General.RegistrationFormUrl);

        return Task.FromResult(registrationRequestSettings);
    }
}
