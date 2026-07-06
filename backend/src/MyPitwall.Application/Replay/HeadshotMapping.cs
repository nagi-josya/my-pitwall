namespace MyPitwall.Application.Replay;

public static class HeadshotMapping
{
    public static string GetHeadshotUrl(int driverNumber, string fullName, string teamColor)
    {
        var color = teamColor.TrimStart('#');
        var name = Uri.EscapeDataString(fullName);
        return $"https://ui-avatars.com/api/?name={name}&background={color}&color=fff&size=96&rounded=true&bold=true";
    }
}
