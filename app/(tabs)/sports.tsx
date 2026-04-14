import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SvgXml } from "react-native-svg";

const BASE_URL = "https://ncaa-api.henrygd.me";


const SPORTS = [
  { sport: "football", division: "fbs", label: "FB" },
  { sport: "basketball-men", division: "d1", label: "MBB" },
  { sport: "basketball-women", division: "d1", label: "WBB" },
  { sport: "baseball", division: "d1", label: "MBA" },
  { sport: "softball", division: "d1", label: "WSB" },
];


export default function Sports() {
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [logos, setLogos] = useState<{ [key: string]: string | null }>({}); // SVG text cache

  useEffect(() => {
    console.log("fetching games");
    fetchTexasGames();
  }, []);

  // fetch logo 
  const fetchLogo = async (seo: string) => {
    if (!seo) {
      console.log("missing seo for logo");
      return;
    }

    if (logos[seo]) {
      console.log("logo already cached:", seo);
      return;
    }

    try {
      console.log("fetching logo:", seo);

      const res = await fetch(`${BASE_URL}/logo/${seo}.svg`);
      const svgText = await res.text();
      setLogos((prev) => ({ ...prev, [seo]: svgText }));
    } catch (err) {
      console.log("Logo fetch failed:", seo, err);
      setLogos((prev) => ({ ...prev, [seo]: null })); // mark as failed
    }
  };

// fetch one sport
  const fetchSport = async (sport: string, division: string, label: string) => {
    const year = new Date().getFullYear();
    const url = `${BASE_URL}/scoreboard/${sport}/${division}/${year}/1/all-conf`;
    console.log(`Fetching sport [${label}]`, url);

    try {
      const res = await fetch(url);

      console.log(`[${label}] status:`, res.status);

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.log(`JSON parse failed for ${label}`, text.slice(0, 300));
        return [];
      }

      if (!data?.games) {
        console.log(`no games found for ${label}`, data);
        return [];
      }

      console.log(`[${label}] total games:`, data.games.length);

      const results: any[] = [];

      for (const g of data.games) {
        const game = g.game;
        if (!game?.home || !game?.away) continue;

        const home = game.home.names.seo;
        const away = game.away.names.seo;
        console.log("FOUND TEAMS:", home, "vs", away);

        const isTexas =
          home === "texas" ||
          away === "texas";

        if (!isTexas) continue;

        results.push({
          ...g,
          sportLabel: label,
        });
      }

      console.log(`[${label}] Texas games found:`, results.length);

      return results;
    } catch (err) {
      console.log(`Fetch sport failed [${label}]`, err);
      return [];
    }
  };


  // main fetch
  const fetchTexasGames = async () => {
    setLoading(true);

    try {

      const results = await Promise.all(
        SPORTS.map((s) => fetchSport(s.sport, s.division, s.label))
      );

      const merged = results.flat();

      merged.sort((a, b) => {
        const aState = a.game?.gameState === "final" ? 0 : 1;
        const bState = b.game?.gameState === "final" ? 0 : 1;
        return bState - aState;
      });

      setGames(merged);
      // preload logos
      const logoSet = new Set<string>();

      merged.forEach((g) => {
        const game = g.game;
        if (!game?.home || !game?.away) return;
        logoSet.add(game.home.names.seo);
        logoSet.add(game.away.names.seo);
      });

      logoSet.forEach(fetchLogo);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  console.log("rendering games:", games.length);

  // UI
  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, paddingHorizontal: 16 }}>
      <View style={styles.container}>
        <Text style={styles.title}>SPORTS</Text>

        <View style={styles.divider} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {games.map((g, idx) => {
            const game = g.game;
            if (!game?.home || !game?.away) return null;

            const home = game.home;
            const away = game.away;
            const isTexasHome = home.names.full.includes("University of Texas at Austin");
            const first = isTexasHome ? home : away;
            const second = isTexasHome ? away : home;

            return (
              <View key={game.gameID || idx} style={styles.card}>
                <Text style={styles.sportLabel}>{g.sportLabel}</Text>
                {/* TEXAS ROW */}
                <View style={styles.row}>
                  {logos[first.names.seo] ? (
                    <SvgXml width={30} height={30} xml={logos[first.names.seo]} />
                  ) : (
                    <View style={[styles.logo, { backgroundColor: "#ccc" }]} />
                  )}
                  <Text style={styles.teamName}>{first.names.char6}</Text>
                  <Text style={styles.score}>{first.score}</Text>
                </View>

                {/* OPPONENT ROW */}
                <View style={styles.row}>
                  {logos[second.names.seo] ? (
                    <SvgXml width={30} height={30} xml={logos[second.names.seo]} />
                  ) : (
                    <View style={[styles.logo, { backgroundColor: "#ccc" }]} />
                  )}
                  <Text style={styles.teamName}>{second.names.char6}</Text>
                  <Text style={styles.score}>{second.score}</Text>
                </View>

                {/* GAME STATE */}
                <Text style={styles.gameState}>
                  {game.gameState?.toUpperCase()}
                </Text>
              </View>
            );
          })}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: { 
    fontSize: 30, 
    fontWeight: "bold" 
  },
  card: {
    width: 220,
    height: 140,
    backgroundColor: "#fff",
    marginHorizontal: 5,
    padding: 15,
    borderRadius: 12,
  },
  sportLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: "#555",
    marginBottom: 6,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  logo: {
    width: 30,
    height: 30,
    backgroundColor: "#ccc",
  },
  teamName: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
  score: {
    fontSize: 18,
    fontWeight: "bold",
  },
  gameState: {
    fontSize: 15,
    fontWeight: "600",
    color: "#8e8e8e",
  },
  divider: {
    height: 3,
    backgroundColor: "#8e8e8e",
    borderRadius: 12,
    marginBottom: 12,
  },
});