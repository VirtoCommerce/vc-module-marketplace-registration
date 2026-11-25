using VirtoCommerce.MarketplaceRegistrationModule.Core.Models;
using VirtoCommerce.StateMachineModule.Core.Services;

namespace VirtoCommerce.MarketplaceRegistrationModule.Web;

/// <summary>
/// Entity types this module's state machines are defined for. The Admin Shell state machine editor lists them from the
/// server; the AngularJS one still gets them from stateMachineTypes.addType in module.js.
/// </summary>
public static class StateMachineEntityTypes
{
    public static void Register(IStateMachineEntityTypeRegistrar registrar)
    {
        registrar.Register<RegistrationRequest>("Seller registration request");
    }
}
