import { MY_TEAMS_DETAIL } from '../../data/scene-data';
import type { ComponentChildren } from 'preact';
import { BgWeekdayAM, BgWeekdayPM, BgWeekendAM, BgWeekendPM, BgAuburn, BgChelsea, BgCamden } from './Backgrounds';
import { Greeting, WeatherModule, MarketsModule, NewsModule, NowPlaying, QuoteModule, PinnedRow } from '../modules/LifeModules';
import { MeetingTimeline, ProjectsModule, InboxModule, NotesModule, DevQuicklaunch, WorkShortcuts, RedHatNews } from '../modules/WorkModules';
import { SportsBoard, MyTeamsRail, FantasyModule, EventTakeover, ScoreRecap, TeamDeepDive } from '../modules/SportsModules';
import { TonightHero, GroceriesModule, WeekendMealPlan, SeasonalNote } from '../modules/CookingModules';
import { WorkCalendar, PersonalCalendar, YouTubeFrame, YouTubeQueue, StreamingShelf } from '../modules/ExtraModules';

interface SceneShellProps {
  children: ComponentChildren;
  bg: ComponentChildren;
  scopeClass?: string;
}

function SceneShell({ children, bg, scopeClass = "" }: SceneShellProps) {
  return (
    <div className={`scene-enter ${scopeClass}`} style={{ minHeight: "100vh", position: "relative" }}>
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>{bg}</div>
      <div className="relative z-10 max-w-scene mx-auto px-10 pt-10 pb-24">
        {children}
      </div>
    </div>
  );
}

function pickBg(scene: string, teamNight: string | null) {
  if (teamNight === "auburn") return <BgAuburn />;
  if (teamNight === "chelsea") return <BgChelsea />;
  if (teamNight === "camden") return <BgCamden />;
  if (scene === "wkdy_am") return <BgWeekdayAM />;
  if (scene === "wkdy_pm") return <BgWeekdayPM />;
  if (scene === "wknd_am") return <BgWeekendAM />;
  return <BgWeekendPM />;
}

function teamScopeClass(teamNight: string | null) {
  if (teamNight === "auburn") return "scene-team team-auburn";
  if (teamNight === "chelsea") return "scene-team team-chelsea";
  if (teamNight === "camden") return "scene-team team-camden";
  return "";
}

export function SceneWeekdayAM({ teamNight, userName }: { teamNight: string | null; userName?: string }) {
  return (
    <SceneShell scopeClass={teamNight ? teamScopeClass(teamNight) : "scene-wkdy-am"}
      bg={pickBg("wkdy_am", teamNight)}
>
      <Greeting scene="wkdy_am" name={userName} />
      <div className="mt-8 grid grid-cols-12 gap-5">
        <div className="col-span-8"><MeetingTimeline now="08:18" phase="day" /></div>
        <div className="col-span-4 space-y-4">
          <WeatherModule />
          <MarketsModule phase="open" />
        </div>
      </div>
      <div className="mt-5 grid grid-cols-12 gap-5">
        <div className="col-span-5 space-y-5">
          <ProjectsModule />
          <PersonalCalendar scene="wkdy_am" />
        </div>
        <div className="col-span-4 space-y-5">
          <InboxModule />
          <NotesModule />
        </div>
        <div className="col-span-3 space-y-5">
          <DevQuicklaunch />
          <WorkShortcuts />
          <RedHatNews />
        </div>
      </div>
      <div className="mt-5 grid grid-cols-12 gap-5">
        <div className="col-span-8"><NewsModule feeds={["bloomberg", "hn"]} hero="Fed minutes split the room: only one cut on the table for 2026." /></div>
        <div className="col-span-4 flex flex-col justify-between">
          <QuoteModule idx={2} />
          <div className="font-mono text-muted" style={{ fontSize: "10.5px" }}>Spring · Wednesday · day 127</div>
        </div>
      </div>
    </SceneShell>
  );
}

export function SceneWeekdayPM({ teamNight, userName }: { teamNight: string | null; userName?: string }) {
  return (
    <SceneShell scopeClass={teamNight ? teamScopeClass(teamNight) : ""}
      bg={pickBg("wkdy_pm", teamNight)}
>
      <Greeting scene="wkdy_pm" name={userName} />
      <div className="mt-8 grid grid-cols-12 gap-5">
        <div className="col-span-7"><TonightHero size="large" /></div>
        <div className="col-span-5"><YouTubeFrame /></div>
      </div>
      <div className="mt-5 grid grid-cols-12 gap-5">
        <div className="col-span-5 space-y-5">
          <SportsBoard slate="weekday_evening" title="tonight" subtitle="Sox-Jays late, Wolves-Nuggets primetime." />
          <FantasyModule />
        </div>
        <div className="col-span-4 space-y-5">
          <StreamingShelf />
          <NowPlaying />
        </div>
        <div className="col-span-3 space-y-5">
          <GroceriesModule />
          <YouTubeQueue />
        </div>
      </div>
      <div className="mt-5 grid grid-cols-12 gap-5">
        <div className="col-span-4"><WorkCalendar phase="evening" /></div>
        <div className="col-span-4"><PersonalCalendar scene="wkdy_pm" /></div>
        <div className="col-span-4 space-y-3">
          <NewsModule feeds={["nyt", "cnn"]} />
          <SeasonalNote />
        </div>
      </div>
    </SceneShell>
  );
}

export function SceneWeekendAM({ teamNight, userName }: { teamNight: string | null; userName?: string }) {
  const featured = teamNight === "chelsea" ? MY_TEAMS_DETAIL[2]
    : teamNight === "camden" ? MY_TEAMS_DETAIL[1]
    : MY_TEAMS_DETAIL[0];
  return (
    <SceneShell scopeClass={teamNight ? teamScopeClass(teamNight) : "scene-wknd-am"}
      bg={pickBg("wknd_am", teamNight)}
>
      <Greeting scene="wknd_am" name={userName} />
      <div className="mt-8"><EventTakeover /></div>
      <div className="mt-5 grid grid-cols-12 gap-5">
        <div className="col-span-7 space-y-5">
          <TeamDeepDive team={featured} />
          <SportsBoard slate="weekend_morning" title="today's slate" subtitle="Masters R3, Auburn-Georgia, Madrid SF, UCL semi 2nd leg." />
        </div>
        <div className="col-span-5 space-y-5">
          <MyTeamsRail />
          <FantasyModule />
          <WeatherModule />
        </div>
      </div>
      <div className="mt-5 grid grid-cols-12 gap-5">
        <div className="col-span-5"><WeekendMealPlan /></div>
        <div className="col-span-4"><PersonalCalendar scene="wknd_am" /></div>
        <div className="col-span-3">
          <QuoteModule idx={1} />
        </div>
      </div>
    </SceneShell>
  );
}

export function SceneWeekendPM({ teamNight, userName }: { teamNight: string | null; userName?: string }) {
  const featured = teamNight === "chelsea" ? MY_TEAMS_DETAIL[2]
    : teamNight === "auburn" ? MY_TEAMS_DETAIL[0]
    : teamNight === "camden" ? MY_TEAMS_DETAIL[1]
    : MY_TEAMS_DETAIL[4];
  return (
    <SceneShell scopeClass={teamNight ? teamScopeClass(teamNight) : ""}
      bg={pickBg("wknd_pm", teamNight)}
>
      <Greeting scene="wknd_pm" name={userName} />
      <div className="mt-8 grid grid-cols-12 gap-5">
        <div className="col-span-7"><TonightHero size="large" /></div>
        <div className="col-span-5 space-y-5">
          <YouTubeFrame />
          <ScoreRecap />
        </div>
      </div>
      <div className="mt-5 grid grid-cols-12 gap-5">
        <div className="col-span-7"><StreamingShelf /></div>
        <div className="col-span-5 space-y-5">
          <TeamDeepDive team={featured} />
        </div>
      </div>
      <div className="mt-5 grid grid-cols-12 gap-5">
        <div className="col-span-4"><SportsBoard slate="weekend_evening" title="primetime · late" subtitle="Wolves-Nuggets G4. UFC 322. Masters R4 prep." /></div>
        <div className="col-span-4"><YouTubeQueue /></div>
        <div className="col-span-4 space-y-5">
          <FantasyModule />
          <NowPlaying />
        </div>
      </div>
      <div className="mt-5 grid grid-cols-12 gap-5">
        <div className="col-span-4"><GroceriesModule /></div>
        <div className="col-span-4"><PersonalCalendar scene="wknd_pm" /></div>
        <div className="col-span-4 space-y-3">
          <PinnedRow pins={[
            { n: "YouTube", i: "video" }, { n: "Netflix", i: "tv" }, { n: "Max", i: "tv" }, { n: "YT Music", i: "headphones" }, { n: "X", i: "sparkles" }, { n: "Reddit", i: "link" },
          ]} />
          <QuoteModule idx={3} />
        </div>
      </div>
    </SceneShell>
  );
}
