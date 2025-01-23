using System;
using System.Collections.Generic;
using VirtoCommerce.Platform.Core.Common;
using VirtoCommerce.Platform.Core.DynamicProperties;

namespace VirtoCommerce.MarketplaceRegistrationModule.Core.Models;
public class RegistrationRequest : AuditableEntity, ICloneable, IHasDynamicProperties
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string OrganizationName { get; set; }
    public string ContactEmail { get; set; }
    public string ContactPhone { get; set; }
    public string Status { get; set; }
    public string DeclineReason { get; set; }

    public string ObjectType { get; set; } = typeof(RegistrationRequest).FullName;

    public ICollection<DynamicObjectProperty> DynamicProperties { get; set; }

    #region ICloneable members
    public virtual object Clone()
    {
        return MemberwiseClone();
    }
    #endregion ICloneable members
}
