using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using VirtoCommerce.MarketplaceRegistrationModule.Core.Models;
using VirtoCommerce.MarketplaceRegistrationModule.Core.PushNotifications;
using VirtoCommerce.MarketplaceRegistrationModule.Core.Services;
using VirtoCommerce.MarketplaceVendorModule.Core;
using VirtoCommerce.MarketplaceVendorModule.StateMachine.Services;
using VirtoCommerce.Platform.Core.PushNotifications;
using ModuleConstants = VirtoCommerce.MarketplaceRegistrationModule.Core.ModuleConstants;

namespace VirtoCommerce.MarketplaceRegistrationModule.Data.Services;
public class RegistrationRequestService : IRegistrationRequestService
{
    private readonly IRegistrationRequestCrudService _registrationRequestCrudService;
    private readonly IStateMachineDefinitionService _stateMachineDefinitionService;
    private readonly IStateMachineInstanceService _stateMachineInstanceService;
    private readonly IPushNotificationManager _pushNotificationManager;
    private readonly MarketplaceOptions _options;

    public RegistrationRequestService(
        IRegistrationRequestCrudService registrationRequestCrudService,
        IStateMachineDefinitionService stateMachineDefinitionService,
        IStateMachineInstanceService stateMachineInstanceService,
        IPushNotificationManager pushNotificationManager,
        IOptions<MarketplaceOptions> options
        )
    {
        _registrationRequestCrudService = registrationRequestCrudService;
        _stateMachineDefinitionService = stateMachineDefinitionService;
        _stateMachineInstanceService = stateMachineInstanceService;
        _pushNotificationManager = pushNotificationManager;
        _options = options.Value;
    }

    public virtual async Task<RegistrationRequest> CreateRegistrationRequest(RegistrationRequest registrationRequest)
    {
        registrationRequest.Id = Guid.NewGuid().ToString();

        //Create state machine instance for registration request
        var customerOrderStateMachineDefinition = await _stateMachineDefinitionService.GetActiveStateMachineDefinitionAsync(ModuleConstants.StateMachineObjectType.RegistrationRequest);
        if (customerOrderStateMachineDefinition != null)
        {
            var stateMachineInstance = await _stateMachineInstanceService.CreateStateMachineInstanceAsync(customerOrderStateMachineDefinition.Id, null, registrationRequest);
            registrationRequest.Status = stateMachineInstance.CurrentStateName;
        }

        await _registrationRequestCrudService.SaveChangesAsync([registrationRequest]);

        await PublishNotification(registrationRequest);

        return registrationRequest;
    }

    protected virtual async Task PublishNotification(RegistrationRequest registrationRequest)
    {
        var pushNotificationRecipient = _options.OperatorGroupId;
        var pushNotification = new RegistrationRequestPushNotification(pushNotificationRecipient)
        {
            Title = "You’ve received a new Vendor registration request",
            Description = "Click the notification to open it",
            RegistrationRequestId = registrationRequest.Id,
        };

        await _pushNotificationManager.SendAsync(pushNotification);
    }
}
