using FluentValidation.Results;
using VirtoCommerce.MarketplaceRegistrationModule.Core.Models;

namespace VirtoCommerce.MarketplaceRegistrationModule.Data.Validators;
public static class RegistrationRequestErrorDescriber
{
    public static ValidationFailure RequestEmailAlreadyExists(string contactEmail)
    {
        var result = new ValidationFailure(nameof(RegistrationRequest.ContactEmail), $"A registration request with the email: {contactEmail} already exists, please change the email.") { AttemptedValue = contactEmail, ErrorCode = "REQUEST_EMAIL_ALREADY_EXISTS" };
        return result;
    }

    public static ValidationFailure SellerEmailAlreadyExists(string contactEmail)
    {
        var result = new ValidationFailure(nameof(RegistrationRequest.ContactEmail), $"A Seller with the email: {contactEmail} already exists, please change the email.") { AttemptedValue = contactEmail, ErrorCode = "SELLER_EMAIL_ALREADY_EXISTS" };
        return result;
    }

    public static ValidationFailure SellerNameAlreadyExists(string organizationName)
    {
        var result = new ValidationFailure(nameof(RegistrationRequest.OrganizationName), $"A Seller with the name: {organizationName} already exists, please change the organization name.") { AttemptedValue = organizationName, ErrorCode = "SELLER_NAME_ALREADY_EXISTS" };
        return result;
    }
}
