import React, { useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:3000"; // or the deployed API URL

const App = () => {
  const [username, setUsername] = useState("");
  const [data, setData] = useState({});
  const [error, setError] = useState("");

  const fetchAll = async () => {
    try {
      const endpoints = {
        profile: `/userProfile/${username}`,
        badges: `/${username}/badges`,
        solved: `/${username}/solved`,
        contest: `/${username}/contest`,
        contestHistory: `/${username}/contest/history`,
        submission: `/${username}/submission`,
        acSubmission: `/${username}/acSubmission`,
        calendar: `/${username}/calendar`,
        langStats: `/languageStats?username=${username}`,
        skillStats: `/skillStats/${username}`,
        ranking: `/userContestRankingInfo/${username}`,
        dailyQuestion: `/dailyQuestion`,
      };

      const keys = Object.keys(endpoints);
      const promises = keys.map((key) =>
        axios.get(`${API_BASE}${endpoints[key]}`)
      );

      const results = await Promise.all(promises);
      const fetchedData = {};
      keys.forEach((key, i) => {
        fetchedData[key] = results[i].data;
      });

      setData(fetchedData);
      setError("");
    } catch (err) {
      setError("❌ Failed to fetch some data. Check username or server.");
      console.error(err);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>LeetCode Stats Viewer</h1>
      <input
        placeholder="Enter LeetCode username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button onClick={fetchAll}>Fetch</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {data.profile && (
        <>
          <h2>👤 Profile</h2>
          <img
            src={data.profile.profile?.userAvatar}
            alt="avatar"
            width={100}
          />
          <p>Name: {data.profile.profile?.realName}</p>
          <p>Ranking: {data.profile.profile?.ranking}</p>
          <p>Country: {data.profile.profile?.countryName}</p>
        </>
      )}

      {data.badges && (
        <>
          <h2>🎖 Badges</h2>
          {data.badges.badges?.map((badge) => (
            <div key={badge.displayName}>
              <img src={badge.icon} alt="badge" width={30} />{" "}
              {badge.displayName}
            </div>
          ))}
        </>
      )}

      {data.solved && (
        <>
          <h2>✅ Solved Stats</h2>
          <p>Easy: {data.solved.easySolved}</p>
          <p>Medium: {data.solved.mediumSolved}</p>
          <p>Hard: {data.solved.hardSolved}</p>
        </>
      )}

      {data.contest && (
        <>
          <h2>🏆 Contest</h2>
          <p>Rating: {data.contest.contestRating}</p>
          <p>Global Rank: {data.contest.contestGlobalRanking}</p>
        </>
      )}

      {data.submission && (
        <>
          <h2>📝 Last 20 Submissions</h2>
          <ul>
            {data.submission.submission?.slice(0, 5).map((s, i) => (
              <li key={i}>
                {s.title} - {s.statusDisplay} ({s.lang})
              </li>
            ))}
          </ul>
        </>
      )}

      {data.acSubmission && (
        <>
          <h2>✅ Last Accepted</h2>
          <ul>
            {data.acSubmission.submission?.slice(0, 5).map((s, i) => (
              <li key={i}>
                {s.title} - {new Date(s.timestamp * 1000).toLocaleString()}
              </li>
            ))}
          </ul>
        </>
      )}

      {data.langStats && (
        <>
          <h2>🧠 Language Stats</h2>
          <ul>
            {data.langStats.matchedUser.languageProblemCount?.map((lang, i) => (
              <li key={i}>
                {lang.languageName}: {lang.problemsSolved} solved
              </li>
            ))}
          </ul>
        </>
      )}

      {data.skillStats?.matchedUser?.tagProblemCounts && (
        <>
          <h2>📚 Skill Stats</h2>
          <ul>
            {["fundamental", "intermediate", "advanced"].map((level) =>
              data.skillStats.matchedUser.tagProblemCounts[level]?.map(
                (skill, i) => (
                  <li key={`${level}-${i}`}>
                    {level.toUpperCase()} - {skill.tagName}:{" "}
                    {skill.problemsSolved}
                  </li>
                )
              )
            )}
          </ul>
        </>
      )}

      {data.dailyQuestion?.activeDailyCodingChallengeQuestion?.question && (
        <>
          <h2>📅 Daily Question</h2>
          <p>
            {
              data.dailyQuestion.activeDailyCodingChallengeQuestion.question
                .title
            }
          </p>
          <a
            href={
              "https://leetcode.com" +
              data.dailyQuestion.activeDailyCodingChallengeQuestion.link
            }
            target="_blank"
            rel="noreferrer"
          >
            Go to Problem
          </a>
        </>
      )}
    </div>
  );
};

export default App;
