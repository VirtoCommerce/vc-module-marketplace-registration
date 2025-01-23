using System;
using System.ComponentModel.DataAnnotations;
using VirtoCommerce.MarketplaceRegistrationModule.Core.Models;
using VirtoCommerce.Platform.Core.Common;
using VirtoCommerce.Platform.Core.Domain;

namespace VirtoCommerce.MarketplaceRegistrationModule.Data.Models;
public class RegistrationRequestEntity : AuditableEntity, IDataEntity<RegistrationRequestEntity, RegistrationRequest>
{
    [StringLength(256)]
    public string FirstName { get; set; }

    [StringLength(256)]
    public string LastName { get; set; }

    [StringLength(1024)]
    public string OrganizationName { get; set; }

    [StringLength(128)]
    public string ContactEmail { get; set; }

    [StringLength(128)]
    public string ContactPhone { get; set; }

    [StringLength(64)]
    public string Status { get; set; }

    public string DeclineReason { get; set; }

    public virtual RegistrationRequestEntity FromModel(RegistrationRequest model, PrimaryKeyResolvingMap pkMap)
    {
        if (model == null)
        {
            throw new ArgumentNullException(nameof(model));
        }

        pkMap.AddPair(model, this);

        Id = model.Id;
        CreatedBy = model.CreatedBy;
        CreatedDate = model.CreatedDate;
        ModifiedBy = model.ModifiedBy;
        ModifiedDate = model.ModifiedDate;

        FirstName = model.FirstName;
        LastName = model.LastName;
        OrganizationName = model.OrganizationName;
        ContactEmail = model.ContactEmail;
        ContactPhone = model.ContactPhone;
        Status = model.Status;
        DeclineReason = model.DeclineReason;

        return this;
    }

    public virtual RegistrationRequest ToModel(RegistrationRequest model)
    {
        if (model == null)
        {
            throw new ArgumentNullException(nameof(model));
        }

        model.Id = Id;
        model.CreatedBy = CreatedBy;
        model.CreatedDate = CreatedDate;
        model.ModifiedBy = ModifiedBy;
        model.ModifiedDate = ModifiedDate;

        model.FirstName = FirstName;
        model.LastName = LastName;
        model.OrganizationName = OrganizationName;
        model.ContactEmail = ContactEmail;
        model.ContactPhone = ContactPhone;
        model.Status = Status;
        model.DeclineReason = DeclineReason;

        return model;
    }

    public virtual void Patch(RegistrationRequestEntity target)
    {
        if (target == null)
        {
            throw new ArgumentNullException(nameof(target));
        }

        target.FirstName = FirstName;
        target.LastName = LastName;
        target.OrganizationName = OrganizationName;
        target.ContactEmail = ContactEmail;
        target.ContactPhone = ContactPhone;
        target.Status = Status;
        target.DeclineReason = DeclineReason;
    }
}
