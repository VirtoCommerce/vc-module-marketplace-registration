using System.Linq;
using FluentValidation;
using VirtoCommerce.MarketplaceRegistrationModule.Core.Models.Search;
using VirtoCommerce.MarketplaceRegistrationModule.Core.Services;
using VirtoCommerce.MarketplaceVendorModule.Core.Common;
using VirtoCommerce.Platform.Core.Common;
using VirtoCommerce.Platform.Core.Security;
using VirtoCommerce.Platform.Core.Security.Search;
using VirtoCommerce.StateMachineModule.Core.Services;
using static VirtoCommerce.MarketplaceRegistrationModule.Core.ModuleConstants;

namespace VirtoCommerce.MarketplaceRegistrationModule.Data.Validators;
public class RegistrationRequestValidator : RegistrationRequestValidatorBase
{
    public RegistrationRequestValidator(
        IRegistrationRequestSearchService _registrationRequestSearchService,
        IStateMachineDefinitionService _stateMachineDefinitionService,
        IUserSearchService _userSearchService
        )
    {
        RuleFor(x => x).NotNull();

        RuleFor(x => x).CustomAsync(async (registrationRequest, context, token) =>
        {
            //Search accross all undeclined registration requests a request with same contact emails
            var registrationRequestSearchCriteria = ExType<SearchRegistrationRequestCriteria>.New();
            registrationRequestSearchCriteria.ContactEmail = registrationRequest.ContactEmail;
            // use only requests with non-final statuses
            var stateMachineDefinition = await _stateMachineDefinitionService.GetActiveStateMachineDefinitionAsync(StateMachineObjectType.RegistrationRequest);
            if (stateMachineDefinition != null && !stateMachineDefinition.States.IsNullOrEmpty())
            {
                registrationRequestSearchCriteria.Statuses = stateMachineDefinition.States.Where(x => !x.IsFinal).Select(x => x.Name).ToArray();
            }
            registrationRequestSearchCriteria.Take = 1;

            var registrationRequestSearchResult = await _registrationRequestSearchService.SearchAsync(registrationRequestSearchCriteria);
            var requstrationRequestWithSameEmail = registrationRequestSearchResult.Results.FirstOrDefault();
            if (requstrationRequestWithSameEmail != null && registrationRequest.Id != requstrationRequestWithSameEmail.Id)
            {
                context.AddFailure(RegistrationRequestErrorDescriber.RequestEmailAlreadyExists(registrationRequest.ContactEmail));
            }
        });

        RuleFor(x => x).CustomAsync(async (registrationRequest, context, token) =>
        {
            //Search accross all users with same contact emails
            var userSearchCriteria = ExType<UserSearchCriteria>.New();
            userSearchCriteria.Keyword = registrationRequest.ContactEmail;
            userSearchCriteria.Take = 1;

            var userSearchResult = await _userSearchService.SearchUsersAsync(userSearchCriteria);
            var userWithSameEmail = userSearchResult.Results.FirstOrDefault();
            if (userWithSameEmail != null)
            {
                context.AddFailure(RegistrationRequestErrorDescriber.SellerEmailAlreadyExists(registrationRequest.ContactEmail));
            }
        });
    }
}
