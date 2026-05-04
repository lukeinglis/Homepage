// Composed scenes. Each scene is a fully-curated layout — modules vary by time + intent.
// Scenes also support a "team night" override (auburn / chelsea / camden) that swaps the background
// and recolors module accents. The scene LAYOUT stays the same; the world around it shifts.

function SceneShell({ children, bg, scrim, scopeClass="" }) {
  return (
    <div className={`scene-enter ${scopeClass}`} style={{minHeight:"100vh", position:"relative"}}>
      <div style={{position:"fixed", inset:0, zIndex:0, pointerEvents:"none"}}>{bg}</div>
      {scrim && <div aria-hidden style={{position:"fixed", inset:0, background: scrim, pointerEvents:"none", zIndex:1}}/>}
      <div className="relative z-10 max-w-[1440px] mx-auto px-10 pt-10 pb-24">
        {children}
      </div>
    </div>
  );
}

// ─── helper: pick the right background by team-night ───────────────────
function pickBg(scene, teamNight) {
  if (teamNight === "auburn")  return <BgAuburn/>;
  if (teamNight === "chelsea") return <BgChelsea/>;
  if (teamNight === "camden")  return <BgCamden/>;
  if (scene === "wkdy_am") return <BgWeekdayAM/>;
  if (scene === "wkdy_pm") return <BgWeekdayPM/>;
  if (scene === "wknd_am") return <BgWeekendAM/>;
  return <BgWeekendPM/>;
}

// scrims kept very light so the illustrated background remains the hero
function pickScrim(scene, teamNight) {
  if (teamNight) return null; // team scenes already have strong dark sky
  if (scene === "wkdy_pm" || scene === "wknd_pm") return null;
  return null; // morning scenes painterly already, no scrim
}

function teamScopeClass(teamNight) {
  if (teamNight === "auburn")  return "scene-team team-auburn";
  if (teamNight === "chelsea") return "scene-team team-chelsea";
  if (teamNight === "camden")  return "scene-team team-camden";
  return "";
}

// ───────────────────────── WEEKDAY MORNING ─────────────────────────────
// Heavy work + market context. Light cooking presence (breakfast cue).
function SceneWeekdayAM({ teamNight }) {
  return (
    <SceneShell scopeClass={teamNight ? teamScopeClass(teamNight) : "scene-wkdy-am"}
                bg={pickBg("wkdy_am", teamNight)}
                scrim={pickScrim("wkdy_am", teamNight)}>
      <Greeting scene="wkdy_am"/>
      <div className="mt-8 grid grid-cols-12 gap-5">
        <div className="col-span-8"><MeetingTimeline now="08:18" phase="day"/></div>
        <div className="col-span-4 space-y-4">
          <WeatherModule scene="wkdy_am"/>
          <MarketsModule phase="open"/>
        </div>
      </div>
      <div className="mt-5 grid grid-cols-12 gap-5">
        <div className="col-span-5 space-y-5">
          <ProjectsModule/>
          <PersonalCalendar scene="wkdy_am"/>
        </div>
        <div className="col-span-4 space-y-5">
          <InboxModule/>
          <NotesModule/>
        </div>
        <div className="col-span-3 space-y-5">
          <DevQuicklaunch/>
          <WorkShortcuts/>
          <RedHatNews/>
        </div>
      </div>
      <div className="mt-5 grid grid-cols-12 gap-5">
        <div className="col-span-7"><NewsModule feeds={["bloomberg","hn"]} hero="Fed minutes split the room: only one cut on the table for 2026."/></div>
        <div className="col-span-3"><NetWorthModule/></div>
        <div className="col-span-2 flex flex-col justify-between">
          <QuoteModule idx={2}/>
          <div className="font-mono text-[10.5px] text-muted">Spring · Tuesday · day 124</div>
        </div>
      </div>
    </SceneShell>
  );
}

// ───────────────────────── WEEKDAY EVENING ─────────────────────────────
// Less work · more cooking, sports, tv, youtube. Two calendars (work tail + personal).
function SceneWeekdayPM({ teamNight }) {
  return (
    <SceneShell scopeClass={teamNight ? teamScopeClass(teamNight) : ""}
                bg={pickBg("wkdy_pm", teamNight)}
                scrim={pickScrim("wkdy_pm", teamNight)}>
      <Greeting scene="wkdy_pm"/>

      {/* hero: cooking + youtube embed (Watch while cooking) */}
      <div className="mt-8 grid grid-cols-12 gap-5">
        <div className="col-span-7"><TonightHero size="large"/></div>
        <div className="col-span-5"><YouTubeFrame sub="Watch while cooking" video={{
          title:"Kenji — Why a hard sear changes everything (12 min)",
          channel:"J. Kenji López-Alt", ch_handle:"@JKenjiLopezAlt",
          durTotal:"12:04", durElapsed:"3:18", viewers:"1.2M views",
          thumb:"linear-gradient(135deg, #4a2a18 0%, #1a0904 50%, #b35c2a 100%)",
        }}/></div>
      </div>

      {/* sports + watch + groceries */}
      <div className="mt-5 grid grid-cols-12 gap-5">
        <div className="col-span-5 space-y-5">
          <SportsBoard slate="weekday_evening" title="tonight" subtitle="Sox-Jays late, Wolves-Nuggets primetime."/>
          <FantasyModule/>
        </div>
        <div className="col-span-4 space-y-5">
          <StreamingShelf scene="wkdy_pm"/>
          <NowPlaying/>
        </div>
        <div className="col-span-3 space-y-5">
          <GroceriesModule/>
          <YouTubeQueue scene="wkdy_pm"/>
        </div>
      </div>

      {/* split calendars + tail of work + light news */}
      <div className="mt-5 grid grid-cols-12 gap-5">
        <div className="col-span-4"><WorkCalendar phase="evening"/></div>
        <div className="col-span-4"><PersonalCalendar scene="wkdy_pm"/></div>
        <div className="col-span-4 space-y-3">
          <NewsModule feeds={["nyt","cnn"]}/>
          <SeasonalNote/>
        </div>
      </div>
    </SceneShell>
  );
}

// ───────────────────────── WEEKEND MORNING ─────────────────────────────
// Sports-heavy: Masters takeover + my teams deep dive + slate. Light errands.
function SceneWeekendAM({ teamNight }) {
  // pick a featured team (Auburn on game day if no override)
  const featured = teamNight === "chelsea" ? window.MY_TEAMS_DETAIL[2]
                 : teamNight === "camden"  ? window.MY_TEAMS_DETAIL[1]
                 : window.MY_TEAMS_DETAIL[0]; // Auburn default
  return (
    <SceneShell scopeClass={teamNight ? teamScopeClass(teamNight) : "scene-wknd-am"}
                bg={pickBg("wknd_am", teamNight)}
                scrim={pickScrim("wknd_am", teamNight)}>
      <Greeting scene="wknd_am"/>

      <div className="mt-8"><EventTakeover/></div>

      <div className="mt-5 grid grid-cols-12 gap-5">
        <div className="col-span-7 space-y-5">
          <TeamDeepDive team={featured}/>
          <SportsBoard slate="weekend_morning" title="today's slate" subtitle="Masters R3, Auburn-Georgia, Madrid SF, UCL semi 2nd leg."/>
        </div>
        <div className="col-span-5 space-y-5">
          <MyTeamsRail/>
          <FantasyModule/>
          <WeatherModule scene="wknd_am"/>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-12 gap-5">
        <div className="col-span-5"><WeekendMealPlan/></div>
        <div className="col-span-4"><PersonalCalendar scene="wknd_am"/></div>
        <div className="col-span-3 space-y-4">
          <ShoppingModule/>
          <QuoteModule idx={1}/>
        </div>
      </div>
    </SceneShell>
  );
}

// ───────────────────────── WEEKEND EVENING ─────────────────────────────
// Cinematic. Cooking + sports recap + streaming + youtube + zero work.
function SceneWeekendPM({ teamNight }) {
  const featured = teamNight === "chelsea" ? window.MY_TEAMS_DETAIL[2]
                 : teamNight === "auburn"  ? window.MY_TEAMS_DETAIL[0]
                 : teamNight === "camden"  ? window.MY_TEAMS_DETAIL[1]
                 : window.MY_TEAMS_DETAIL[4]; // Wolves WCSF G4
  return (
    <SceneShell scopeClass={teamNight ? teamScopeClass(teamNight) : ""}
                bg={pickBg("wknd_pm", teamNight)}
                scrim={pickScrim("wknd_pm", teamNight)}>
      <Greeting scene="wknd_pm"/>

      <div className="mt-8 grid grid-cols-12 gap-5">
        <div className="col-span-7"><TonightHero size="large"/></div>
        <div className="col-span-5 space-y-5">
          <YouTubeFrame sub="On the TV" video={{
            title: teamNight==="chelsea" ? "Stamford Bridge — Chelsea v Man City · matchday vlog" :
                    teamNight==="camden" ? "Camden Yards — Henderson, in real time"
                                         : "NFL RedZone · Sunday cuts you missed",
            channel: teamNight==="chelsea" ? "Chelsea FC" : teamNight==="camden" ? "Jomboy Media" : "NFL",
            ch_handle: teamNight==="chelsea" ? "@ChelseaFC" : teamNight==="camden" ? "@JomboyMedia" : "@NFL",
            durTotal: "24:11", durElapsed:"6:42", viewers:"841K views",
            thumb: teamNight==="chelsea" ? "linear-gradient(135deg,#0a2a66,#02153b 60%,#5fa9e3)" :
                    teamNight==="camden" ? "linear-gradient(135deg,#3a1808,#0e0402 60%,#df4601)"
                                         : "linear-gradient(135deg,#1a3a2a,#06120a 60%,#4a8a5a)",
          }}/>
          <ScoreRecap/>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-12 gap-5">
        <div className="col-span-7"><StreamingShelf scene="wknd_pm"/></div>
        <div className="col-span-5 space-y-5">
          <TeamDeepDive team={featured}/>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-12 gap-5">
        <div className="col-span-4"><SportsBoard slate="weekend_evening" title="primetime · late" subtitle="Wolves-Nuggets G4. UFC 322. Masters R4 prep."/></div>
        <div className="col-span-4"><YouTubeQueue scene="wknd_pm"/></div>
        <div className="col-span-4 space-y-5">
          <FantasyModule/>
          <NowPlaying/>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-12 gap-5">
        <div className="col-span-4"><GroceriesModule/></div>
        <div className="col-span-4"><PersonalCalendar scene="wknd_pm"/></div>
        <div className="col-span-4 space-y-3">
          <PinnedRow pins={[
            {n:"YouTube", i:"video"},{n:"Netflix", i:"tv"},{n:"Max", i:"tv"},{n:"YT Music", i:"headphones"},{n:"X", i:"sparkles"},{n:"Reddit", i:"link"},
          ]}/>
          <QuoteModule idx={3}/>
        </div>
      </div>
    </SceneShell>
  );
}

Object.assign(window, { SceneWeekdayAM, SceneWeekdayPM, SceneWeekendAM, SceneWeekendPM });
