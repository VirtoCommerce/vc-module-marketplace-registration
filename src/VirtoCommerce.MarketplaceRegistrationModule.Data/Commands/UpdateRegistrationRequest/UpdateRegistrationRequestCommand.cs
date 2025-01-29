using System.ComponentModel.DataAnnotations;
using VirtoCommerce.MarketplaceRegistrationModule.Core.Models;
using VirtoCommerce.MarketplaceVendorModule.Core.Common;

namespace VirtoCommerce.MarketplaceRegistrationModule.Data.Commands;
public class UpdateRegistrationRequestCommand : ICommand<RegistrationRequest>
{
    [Required]
    public string Id { get; set; }

    public string Comment { get; set; }
}
