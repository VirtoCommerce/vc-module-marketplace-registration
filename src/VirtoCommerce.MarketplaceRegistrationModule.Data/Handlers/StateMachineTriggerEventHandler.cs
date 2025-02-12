using System.Threading.Tasks;
using VirtoCommerce.MarketplaceRegistrationModule.Core.Services;
using VirtoCommerce.Platform.Core.Common;
using VirtoCommerce.Platform.Core.Events;
using VirtoCommerce.StateMachineModule.Core.Events;
using static VirtoCommerce.MarketplaceRegistrationModule.Core.ModuleConstants;

namespace VirtoCommerce.MarketplaceRegistrationModule.Data.Handlers;
public class StateMachineTriggerEventHandler : IEventHandler<StateMachineTriggerEvent>
{
    private readonly IRegistrationRequestCrudService _registrationRequestCrudService;

    public StateMachineTriggerEventHandler(
        IRegistrationRequestCrudService registrationRequestCrudService
        )
    {
        _registrationRequestCrudService = registrationRequestCrudService;
    }

    public virtual async Task Handle(StateMachineTriggerEvent message)
    {
        var entityType = message.EntityType;
        switch (entityType)
        {
            case StateMachineObjectType.RegistrationRequest:
                var registrationRequestId = message.EntityId;
                var newStatus = message.StateName;

                if (!string.IsNullOrEmpty(newStatus))
                {
                    var registrationRequest = await _registrationRequestCrudService.GetByIdAsync(registrationRequestId);
                    if (registrationRequest != null)
                    {
                        registrationRequest.Status = newStatus;
                        await _registrationRequestCrudService.SaveChangesAsync([registrationRequest]);
                    }
                }
                break;
        }

    }
}
