using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Moq;
using VirtoCommerce.MarketplaceRegistrationModule.Core.Models;
using VirtoCommerce.MarketplaceRegistrationModule.Core.Services;
using VirtoCommerce.MarketplaceRegistrationModule.Data.Queries;
using VirtoCommerce.MarketplaceRegistrationModule.Web.Controllers.Api;
using Xunit;

namespace VirtoCommerce.MarketplaceRegistrationModule.Tests;

[Trait("Category", "Unit")]
public class GetRegistrationRequestByIdTests
{
    [Fact]
    public async Task Handle_ExistingId_ReturnsRegistrationRequest()
    {
        // Arrange
        var registrationRequest = new RegistrationRequest { Id = "request-1", OrganizationName = "Org" };
        var crudService = new Mock<IRegistrationRequestCrudService>();
        crudService
            .Setup(x => x.GetAsync(It.Is<IList<string>>(ids => ids.Count == 1 && ids[0] == "request-1"), null, true))
            .ReturnsAsync([registrationRequest]);
        var handler = new GetRegistrationRequestByIdQueryHandler(crudService.Object);

        // Act
        var result = await handler.Handle(new GetRegistrationRequestByIdQuery { Id = "request-1" }, CancellationToken.None);

        // Assert
        Assert.Same(registrationRequest, result);
    }

    [Fact]
    public async Task Handle_UnknownId_ReturnsNull()
    {
        // Arrange
        var crudService = new Mock<IRegistrationRequestCrudService>();
        crudService
            .Setup(x => x.GetAsync(It.IsAny<IList<string>>(), null, true))
            .ReturnsAsync([]);
        var handler = new GetRegistrationRequestByIdQueryHandler(crudService.Object);

        // Act
        var result = await handler.Handle(new GetRegistrationRequestByIdQuery { Id = "missing" }, CancellationToken.None);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task Handle_NullRequest_Throws()
    {
        // Arrange
        var handler = new GetRegistrationRequestByIdQueryHandler(Mock.Of<IRegistrationRequestCrudService>());

        // Act
        var act = () => handler.Handle(null, CancellationToken.None);

        // Assert
        await Assert.ThrowsAsync<ArgumentNullException>(act);
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    public async Task Handle_EmptyId_Throws(string id)
    {
        // Arrange
        var crudService = new Mock<IRegistrationRequestCrudService>();
        var handler = new GetRegistrationRequestByIdQueryHandler(crudService.Object);

        // Act
        var act = () => handler.Handle(new GetRegistrationRequestByIdQuery { Id = id }, CancellationToken.None);

        // Assert
        await Assert.ThrowsAsync<ArgumentException>(act);
        crudService.Verify(x => x.GetAsync(It.IsAny<IList<string>>(), It.IsAny<string>(), It.IsAny<bool>()), Times.Never);
    }

    [Fact]
    public async Task Controller_GetById_SendsQueryWithRouteId()
    {
        // Arrange
        var registrationRequest = new RegistrationRequest { Id = "request-1" };
        var mediator = new Mock<IMediator>();
        mediator
            .Setup(x => x.Send(It.Is<GetRegistrationRequestByIdQuery>(q => q.Id == "request-1"), It.IsAny<CancellationToken>()))
            .ReturnsAsync(registrationRequest);
        var controller = new VcmpRegistrationRequestController(mediator.Object, Mock.Of<IAuthorizationService>());

        // Act
        var result = await controller.GetById("request-1");

        // Assert
        var ok = Assert.IsType<OkObjectResult>(result.Result);
        Assert.Same(registrationRequest, ok.Value);
    }
}
