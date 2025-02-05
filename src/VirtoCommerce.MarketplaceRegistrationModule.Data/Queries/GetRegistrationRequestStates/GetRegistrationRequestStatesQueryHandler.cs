using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using VirtoCommerce.MarketplaceVendorModule.Core.Common;
using VirtoCommerce.MarketplaceVendorModule.StateMachine.Models;
using VirtoCommerce.MarketplaceVendorModule.StateMachine.Services;
using VirtoCommerce.Platform.Core.Common;
using static VirtoCommerce.MarketplaceRegistrationModule.Core.ModuleConstants;

namespace VirtoCommerce.MarketplaceRegistrationModule.Data.Queries.GetRegistrationRequestStates;
public class GetRegistrationRequestStatesQueryHandler : IQueryHandler<GetRegistrationRequestStatesQuery, StateMachineStateShort[]>
{
    private readonly IStateMachineDefinitionService _stateMachineDefinitionService;

    public GetRegistrationRequestStatesQueryHandler(
        IStateMachineDefinitionService stateMachineDefinitionService
        )
    {
        _stateMachineDefinitionService = stateMachineDefinitionService;
    }

    public virtual async Task<StateMachineStateShort[]> Handle(GetRegistrationRequestStatesQuery request, CancellationToken cancellationToken)
    {
        var stateMachineDefinition = await _stateMachineDefinitionService.GetActiveStateMachineDefinitionAsync(StateMachineObjectType.RegistrationRequest);
        if (stateMachineDefinition != null && !stateMachineDefinition.States.IsNullOrEmpty())
        {
            var states = stateMachineDefinition.States.Select(x => new StateMachineStateShort(x)).ToArray();
            return states;
        }
        else
        {
            throw new InvalidOperationException($"State Machine Definition for type {StateMachineObjectType.RegistrationRequest} not found");
        }
    }
}
