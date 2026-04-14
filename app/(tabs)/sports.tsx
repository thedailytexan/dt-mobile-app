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

export default function Sports() {
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [logos, setLogos] = useState<{ [key: string]: string | null }>({}); // SVG text cache

  useEffect(() => {
    fetchTexasGames();
  }, []);

  // fetch logo 
  const fetchLogo = async (seo: string) => {
    if (!seo || logos[seo]) return; // already cached
    try {
      const res = await fetch(`${BASE_URL}/logo/${seo}.svg`);
      const svgText = await res.text();
      setLogos((prev) => ({ ...prev, [seo]: svgText }));
    } catch (err) {
      console.log("Logo fetch failed:", seo, err);
      setLogos((prev) => ({ ...prev, [seo]: null })); // mark as failed
    }
  };

  const fetchTexasGames = async () => {
    console.log("fetchTexasGames...");

    try {
      const now = new Date();
      const currentSeason = now.getMonth() < 6 ? now.getFullYear() - 1 : now.getFullYear();
      const seasons = [currentSeason, currentSeason - 1];
      const seenGameIds = new Set();
      let texasGames: any[] = [];

      for (const year of seasons) {
        console.log("Season:", year);

        for (let week = 15; week >= 1; week--) {
          try {
            const res = await fetch(`${BASE_URL}/scoreboard/football/fbs/${year}/${week}/all-conf`);
            const text = await res.text();
            let data;
            try {
              data = JSON.parse(text);

            } catch {
              continue;
            }

            if (!data.games?.length) continue;

            for (const g of data.games) {
              const game = g.game;
              if (!game?.home || !game?.away) continue;

              const home = game.home.names.full;
              const away = game.away.names.full;
              const isTexas = home.includes("University of Texas at Austin") || away.includes("University of Texas at Austin");
              if (!isTexas) continue;

              console.log("Home SEO:", game.home.names.seo, "Away SEO:", game.away.names.seo);

              if (seenGameIds.has(game.gameID)) continue;
              seenGameIds.add(game.gameID);
              texasGames.push(g);

              // prefetch logos
              fetchLogo(game.home.names.seo);
              fetchLogo(game.away.names.seo);
            }

            if (texasGames.length >= 15) break;
          } catch (err) {
            console.log("Week failed:", year, week);
          }
        }
      }

      console.log("Total Texas games:", texasGames.length);
      setGames(texasGames);
    } catch (err) {
      console.log("Error fetching games:", err);
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

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, paddingHorizontal: 16 }}>
      <View style={styles.container}>
        <View style={{ marginBottom: 10 }}>
          <Text style={{ fontSize: 30, fontWeight: "bold" }}>SPORTS</Text>
        </View>
        <View style={styles.divider} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {games.map((g) => {
            const game = g.game;
            if (!game?.home || !game?.away) return null;

            const home = game.home;
            const away = game.away;
            const isTexasHome = home.names.full.includes("University of Texas at Austin");
            const first = isTexasHome ? home : away;
            const second = isTexasHome ? away : home;

            return (
              <View key={game.gameID} style={styles.card}>
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
                <View>
                  <Text style={styles.gameState}>{game.gameState?.toUpperCase()}</Text>
                </View>
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
  card: {
    width: 220,
    height: 130,
    backgroundColor: "#fff",
    marginHorizontal: 5,
    padding: 15,
    borderRadius: 12,
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