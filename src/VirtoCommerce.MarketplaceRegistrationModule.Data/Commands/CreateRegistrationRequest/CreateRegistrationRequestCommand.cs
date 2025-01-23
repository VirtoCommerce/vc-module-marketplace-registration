using System.ComponentModel.DataAnnotations;
using VirtoCommerce.MarketplaceRegistrationModule.Core.Models;
using VirtoCommerce.MarketplaceVendorModule.Core.Common;

namespace VirtoCommerce.MarketplaceRegistrationModule.Data.Commands;
public class CreateRegistrationRequestCommand : ICommand<RegistrationRequest>
{
    [Required]
    public string FirstName { get; set; }

    [Required]
    public string LastName { get; set; }

    [Required]
    public string OrganizationName { get; set; }

    [Required]
    public string ContactEmail { get; set; }

    public string ContactPhone { get; set; }
}
