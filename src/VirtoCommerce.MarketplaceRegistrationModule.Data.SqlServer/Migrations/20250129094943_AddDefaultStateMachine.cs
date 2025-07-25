using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VirtoCommerce.MarketplaceRegistrationModule.Data.SqlServer.Migrations
{
    /// <inheritdoc />
    public partial class AddDefaultStateMachine : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            #region ---------- RegistrationRequestStateMachineDefinition ----------
            var registrationRequestScript = @"DECLARE @RegistrationRequestStateMachineDefinitionId nvarchar(100)

                SET @RegistrationRequestStateMachineDefinitionId = ''
                SELECT @RegistrationRequestStateMachineDefinitionId = [Id] FROM [dbo].[StateMachineDefinition] WHERE [EntityType] = 'VirtoCommerce.MarketplaceRegistrationModule.Core.Models.RegistrationRequest'

                IF @RegistrationRequestStateMachineDefinitionId = ''
                    BEGIN
                        INSERT INTO [dbo].[StateMachineDefinition]
                            ([Id], [StatesSerialized], [Name], [EntityType], [IsActive], [Version], [CreatedDate], [CreatedBy])
                    VALUES
                        (CONVERT(varchar(128), NEWID()),
                            '[
                                {
                                ""name"": ""Pending"",
                                ""type"": ""StateMachineState"",
                                ""description"": ""Just submitted registartion request"",
                                ""isInitial"": true,
                                ""isFinal"": false,
                                ""stateData"": {},
                                ""transitions"": [
                                    {
                                    ""trigger"": ""CompleteRegistrationRequest"",
                                    ""description"": ""If you want to accept the request"",
                                    ""toState"": ""Completed""
                                    },
                                    {
                                    ""trigger"": ""ProcessRegistrationRequest"",
                                    ""description"": ""If you want to process the request but additional steps required"",
                                    ""toState"": ""Processing""
                                    },
                                    {
                                    ""trigger"": ""DeclineRegistrationRequest"",
                                    ""description"": ""If you want decline the request"",
                                    ""toState"": ""Declined""
                                    }
                                ]
                                },
                                {
                                ""name"": ""Processing"",
                                ""type"": ""StateMachineState"",
                                ""description"": ""Required additional steps to accept this request"",
                                ""isInitial"": false,
                                ""isFinal"": false,
                                ""stateData"": {},
                                ""transitions"": [
                                    {
                                    ""trigger"": ""CompleteRegistrationRequest"",
                                    ""description"": ""If you want to accept the request"",
                                    ""toState"": ""Completed""
                                    },
                                    {
                                    ""trigger"": ""DeclineRegistrationRequest"",
                                    ""description"": ""If you want decline the request"",
                                    ""toState"": ""Declined""
                                    }
                                ]
                                },
                                {
                                ""name"": ""Declined"",
                                ""type"": ""StateMachineState"",
                                ""description"": ""Declined registration request"",
                                ""isInitial"": false,
                                ""isFinal"": true,
                                ""isFailed"": true,
                                ""stateData"": {},
                                ""transitions"": []
                                },
                                {
                                ""name"": ""Completed"",
                                ""type"": ""StateMachineState"",
                                ""description"": ""Registration request converted into a Vendor"",
                                ""isInitial"": false,
                                ""isFinal"": true,
                                ""isSuccess"": true,
                                ""stateData"": {},
                                ""transitions"": []
                                }
                            ]',
                        'seller-registration-request-flow', 'VirtoCommerce.MarketplaceRegistrationModule.Core.Models.RegistrationRequest', 1, '0', GETDATE(), 'Script')
		   
                        END";
            migrationBuilder.Sql(registrationRequestScript);
            #endregion ---------- RegistrationRequestStateMachineDefinition ----------

            #region ---------- RegistrationRequestStateMachineDefinition localization ----------
            var registrationRequestlocalizationScript =
                @"DECLARE @RegistrationRequestStateMachineDefinitionId nvarchar(100)

                SET @RegistrationRequestStateMachineDefinitionId = ''
                SELECT @RegistrationRequestStateMachineDefinitionId = [Id] FROM [dbo].[StateMachineDefinition] WHERE [EntityType] = 'VirtoCommerce.MarketplaceRegistrationModule.Core.Models.RegistrationRequest' AND [IsActive] = 1

                IF @RegistrationRequestStateMachineDefinitionId <> ''
                    BEGIN
                        INSERT INTO [dbo].[StateMachineLocalization]
                            ([Id], [DefinitionId], [Item], [Locale], [Value], [CreatedDate], [CreatedBy])
						VALUES
						    (CONVERT(varchar(128), NEWID()), @RegistrationRequestStateMachineDefinitionId, 'CompleteRegistrationRequest', 'en-US', 'Complete', GETDATE(), 'Script'),
						    (CONVERT(varchar(128), NEWID()), @RegistrationRequestStateMachineDefinitionId, 'ProcessRegistrationRequest',  'en-US', 'Process', GETDATE(), 'Script'),
						    (CONVERT(varchar(128), NEWID()), @RegistrationRequestStateMachineDefinitionId, 'DeclineRegistrationRequest',  'en-US', 'Decline', GETDATE(), 'Script')
					END";
            migrationBuilder.Sql(registrationRequestlocalizationScript);
            #endregion ---------- RegistrationRequestStateMachineDefinition localization ----------

            #region ---------- RegistrationRequestStateMachineDefinition Attribute ----------
            var registrationRequestAttributeScript =
                @"DECLARE @RegistrationRequestStateMachineDefinitionId nvarchar(100)

                SET @RegistrationRequestStateMachineDefinitionId = ''
                SELECT @RegistrationRequestStateMachineDefinitionId = [Id] FROM [dbo].[StateMachineDefinition] WHERE [EntityType] = 'VirtoCommerce.MarketplaceRegistrationModule.Core.Models.RegistrationRequest' AND [IsActive] = 1

                IF @RegistrationRequestStateMachineDefinitionId <> ''
                    BEGIN
                        INSERT INTO [dbo].[StateMachineAttribute]
                            ([Id], [DefinitionId], [Item], [AttributeKey], [Value], [CreatedDate], [CreatedBy])
						VALUES
						    (CONVERT(varchar(128), NEWID()), @RegistrationRequestStateMachineDefinitionId, 'CompleteRegistrationRequest', 'Icon', 'far fa-check-circle', GETDATE(), 'Script'),
						    (CONVERT(varchar(128), NEWID()), @RegistrationRequestStateMachineDefinitionId, 'ProcessRegistrationRequest',  'Icon', 'fas fa-ellipsis-h', GETDATE(), 'Script'),
						    (CONVERT(varchar(128), NEWID()), @RegistrationRequestStateMachineDefinitionId, 'DeclineRegistrationRequest',  'Icon', 'fas fa-times-circle', GETDATE(), 'Script')
					END";
            migrationBuilder.Sql(registrationRequestAttributeScript);
            #endregion ---------- RegistrationRequestStateMachineDefinition Attribute ----------
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
