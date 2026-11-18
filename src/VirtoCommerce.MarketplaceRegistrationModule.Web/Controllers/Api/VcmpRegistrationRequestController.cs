using System.Threading.Tasks;
using FluentValidation.Results;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VirtoCommerce.MarketplaceRegistrationModule.Core.Models;
using VirtoCommerce.MarketplaceRegistrationModule.Core.Models.Search;
using VirtoCommerce.MarketplaceRegistrationModule.Data.Commands;
using VirtoCommerce.MarketplaceRegistrationModule.Data.Queries;
using VirtoCommerce.MarketplaceVendorModule.Core.Common;

namespace VirtoCommerce.MarketplaceRegistrationModule.Web.Controllers.Api;

[Route("api/vcmp/registrationrequest")]
public class VcmpRegistrationRequestController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly IAuthorizationService _authorizationService;

    public VcmpRegistrationRequestController(
        IMediator mediator,
        IAuthorizationService authorizationService
        )
    {
        _mediator = mediator;
        _authorizationService = authorizationService;
    }

    [HttpPost]
    [Route("search")]
    [Authorize(Core.ModuleConstants.Security.Permissions.Read)]
    public async Task<ActionResult<SearchRegistrationRequestResult>> Search([FromBody] SearchRegistrationRequestQuery query)
    {
        var result = await _mediator.Send(query);

        return Ok(result);
    }

    [HttpGet]
    [Route("{id}")]
    [Authorize(Core.ModuleConstants.Security.Permissions.Read)]
    public async Task<ActionResult<RegistrationRequest>> GetById([FromRoute] string id)
    {
        // Bound by the route's own name: a model-bound "Id" makes Swagger declare a path parameter
        // the "{id}" template doesn't have, so generated clients never substitute it
        var query = ExType<GetRegistrationRequestByIdQuery>.New();
        query.Id = id;
        var result = await _mediator.Send(query);

        return Ok(result);
    }

    [HttpPost]
    [Route("validate")]
    public async Task<ActionResult<ValidationFailure[]>> ValidateRegistrationRequest([FromBody] ValidateRegistrationRequestQuery query)
    {
        var result = await _mediator.Send(query);

        return Ok(result);
    }

    [HttpPost]
    [Route("new")]
    public async Task<ActionResult<RegistrationRequest>> CreateRegistrationRequest([FromBody] CreateRegistrationRequestCommand command)
    {
        var result = await _mediator.Send(command);

        return Ok(result);
    }

    [HttpPost]
    [Route("update")]
    [Authorize(Core.ModuleConstants.Security.Permissions.Update)]
    public async Task<ActionResult<RegistrationRequest>> UpdateRegistrationRequest([FromBody] UpdateRegistrationRequestCommand command)
    {
        var result = await _mediator.Send(command);

        return Ok(result);
    }

    [HttpGet]
    [Route("settings")]
    [Authorize(Core.ModuleConstants.Security.Permissions.Read)]
    public async Task<ActionResult<RegistrationRequestSettings>> GetSettings()
    {
        var query = ExType<GetRegistrationRequestSettingsQuery>.New();
        var result = await _mediator.Send(query);

        return Ok(result);
    }
}
