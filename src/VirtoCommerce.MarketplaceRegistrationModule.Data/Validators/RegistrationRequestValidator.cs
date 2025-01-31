using System.Linq;
using FluentValidation;
using VirtoCommerce.CustomerModule.Core.Model.Search;
using VirtoCommerce.CustomerModule.Core.Services;
using VirtoCommerce.MarketplaceRegistrationModule.Core.Models.Search;
using VirtoCommerce.MarketplaceRegistrationModule.Core.Services;
using VirtoCommerce.MarketplaceVendorModule.Core.Common;

namespace VirtoCommerce.MarketplaceRegistrationModule.Data.Validators;
public class RegistrationRequestValidator : RegistrationRequestValidatorBase
{
    public RegistrationRequestValidator(
        IRegistrationRequestSearchService _registrationRequestSearchService,
        IMemberSearchService _memberSearchService
        )
    {
        RuleFor(x => x).NotNull();

        RuleFor(x => x).CustomAsync(async (registrationRequest, context, token) =>
        {
            //Search accross all undeclined registration requests a request with same contact emails
            var registrationRequestSearchCriteria = ExType<SearchRegistrationRequestCriteria>.New();
            registrationRequestSearchCriteria.ContactEmail = registrationRequest.ContactEmail;
            // TODO: configurable and expandable statuses!!!
            registrationRequestSearchCriteria.Statuses = ["Pending", "Processing"];
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
            //Search accross all members with same contact emails
            var membersSearchCriteria = ExType<MembersSearchCriteria>.New();
            membersSearchCriteria.Keyword = registrationRequest.ContactEmail;
            membersSearchCriteria.DeepSearch = true;
            membersSearchCriteria.Take = 1;

            var membersSearchResult = await _memberSearchService.SearchMembersAsync(membersSearchCriteria);
            var memberWithSameEmail = membersSearchResult.Results.FirstOrDefault();
            if (memberWithSameEmail != null)
            {
                context.AddFailure(RegistrationRequestErrorDescriber.SellerEmailAlreadyExists(registrationRequest.ContactEmail));
            }
        });
    }
}
