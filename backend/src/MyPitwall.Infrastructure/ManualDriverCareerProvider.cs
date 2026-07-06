using MyPitwall.Application.Abstractions;
using MyPitwall.Application.OpenF1;

namespace MyPitwall.Infrastructure;

public sealed class ManualDriverCareerProvider : IDriverCareerProvider
{
    private static readonly Dictionary<string, DriverCareerInfo> Data = new()
    {
        ["Max VERSTAPPEN"] = new(2015, 129, 1, [2021, 2022, 2023, 2024]),
        ["Lewis HAMILTON"] = new(2007, 207, 1, [2008, 2014, 2015, 2017, 2018, 2019, 2020]),
        ["Charles LECLERC"] = new(2018, 53, 1, null),
        ["Lando NORRIS"] = new(2019, 46, 1, [2025]),
        ["Carlos SAINZ"] = new(2015, 29, 1, null),
        ["George RUSSELL"] = new(2019, 29, 1, null),
        ["Sergio PEREZ"] = new(2011, 39, 1, null),
        ["Fernando ALONSO"] = new(2001, 106, 1, [2005, 2006]),
        ["Oscar PIASTRI"] = new(2023, 28, 1, null),
        ["Pierre GASLY"] = new(2017, 5, 1, null),
        ["Esteban OCON"] = new(2016, 4, 1, null),
        ["Lance STROLL"] = new(2017, 3, 3, null),
        ["Yuki TSUNODA"] = new(2021, 0, 4, null),
        ["Alexander ALBON"] = new(2019, 3, 3, null),
        ["Nico HULKENBERG"] = new(2010, 1, 4, null),
        ["Kevin MAGNUSSEN"] = new(2014, 1, 2, null),
        ["Daniel RICCIARDO"] = new(2011, 32, 1, null),
        ["Valtteri BOTTAS"] = new(2013, 67, 1, null),
        ["Zhou GUANYU"] = new(2022, 0, 8, null),
        ["Logan SARGEANT"] = new(2023, 0, 10, null),
        ["Liam LAWSON"] = new(2023, 0, 9, null),
        ["Franco COLAPINTO"] = new(2024, 0, 8, null),
        ["Oliver BEARMAN"] = new(2024, 0, 7, null),
        ["Jack DOOHAN"] = new(2024, 0, 14, null),
        ["Nyck DE VRIES"] = new(2022, 0, 9, null),
        ["Kimi RAIKKONEN"] = new(2001, 103, 1, [2007]),
        ["Sebastian VETTEL"] = new(2007, 122, 1, [2010, 2011, 2012, 2013]),
        ["Jenson BUTTON"] = new(2000, 50, 1, [2009]),
        ["Romain GROSJEAN"] = new(2009, 10, 2, null),
        ["Daniil KVYAT"] = new(2014, 3, 2, null),
        ["Antonio GIOVINAZZI"] = new(2017, 0, 5, null),
        ["Mick SCHUMACHER"] = new(2021, 0, 6, null),
        ["Nikita MAZEPIN"] = new(2021, 0, 14, null),
        ["Nicholas LATIFI"] = new(2020, 0, 7, null),
        ["Isack HADJAR"] = new(2025, 0, 11, null),
        ["Kimi ANTONELLI"] = new(2025, 0, 4, null),
        ["Gabriel BORTOLETO"] = new(2025, 0, 14, null),
    };

    public Task<DriverCareerInfo?> GetCareerAsync(string fullName, CancellationToken cancellationToken = default)
    {
        var found = Data.TryGetValue(fullName, out var career);
        return Task.FromResult(found ? career : null);
    }
}
