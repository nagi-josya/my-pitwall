using Microsoft.AspNetCore.Mvc;
using MyPitwall.Application.Abstractions;

namespace MyPitwall.Api.Controllers;

[ApiController]
[Route("api/status")]
public sealed class StatusController(IF1DataProvider dataProvider) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<object>> GetStatus(CancellationToken cancellationToken)
    {
        var message = await dataProvider.CheckAvailabilityAsync(cancellationToken);

        return Ok(new { openf1Message = message });
    }
}
