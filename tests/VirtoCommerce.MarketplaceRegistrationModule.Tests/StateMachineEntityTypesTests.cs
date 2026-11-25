using System.Collections.Generic;
using Moq;
using VirtoCommerce.MarketplaceRegistrationModule.Web;
using VirtoCommerce.StateMachineModule.Core.Models;
using VirtoCommerce.StateMachineModule.Core.Services;
using Xunit;

namespace VirtoCommerce.MarketplaceRegistrationModule.Tests;

[Trait("Category", "Unit")]
public class StateMachineEntityTypesTests
{
    [Fact]
    public void Register_RegistersRegistrationRequestWithoutConditions()
    {
        // Arrange
        var registered = new List<StateMachineEntityType>();
        var registrar = new Mock<IStateMachineEntityTypeRegistrar>();
        registrar.Setup(x => x.Register(It.IsAny<StateMachineEntityType>())).Callback<StateMachineEntityType>(registered.Add);

        // Act
        StateMachineEntityTypes.Register(registrar.Object);

        // Assert
        var entityType = Assert.Single(registered);
        // the id existing definitions store (legacy stateMachineTypes.addType value)
        Assert.Equal("VirtoCommerce.MarketplaceRegistrationModule.Core.Models.RegistrationRequest", entityType.Id);
        Assert.Equal("Seller registration request", entityType.Name);
        Assert.False(entityType.HasConditionTree);
    }
}
