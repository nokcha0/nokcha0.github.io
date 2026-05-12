import { toolGroups } from "../data/website";

export function ToolsSection() {
  return (
    <section id="tools" className="section tools-section">
      <header className="tools-intro">
        <h2>Tools</h2>
        <p>Stuff I use and like to use.</p>
        <p>Last updated: May 2026</p>
      </header>
      <div className="tool-stack">
        {toolGroups.map((group) => (
          <section className="tool-group" key={group.label}>
            <header className="tool-group-head">
              <h3>{group.label}</h3>
            </header>
            <div className="tool-list">
              {group.tools.map((tool) => (
                <article className="tool-item" key={tool.name}>
                  <span className="tool-icon" aria-hidden="true">
                    <img src={tool.icon} alt="" />
                  </span>
                  <div className="tool-copy">
                    <p className="tool-name">{tool.name}</p>
                    <p className="tool-note">{tool.note}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}
