import Link from "next/link";

const feed = "/api/v1/registries/smart-cities-surveillance-registry/feed";

export default function FollowPage() {
  return <main className="page-shell">
    <header className="page-heading"><p className="eyebrow">Follow public changes</p>
      <h1>Follow the registry</h1>
      <p className="lede">Add a feed to your reader to follow newly published and updated records.</p>
    </header>
    <section className="section-block" aria-labelledby="feeds-heading">
      <h2 id="feeds-heading">Public record feeds</h2>
      <p><a href={feed + "?format=atom"}>Subscribe with Atom</a> or <a href={feed}>use JSON Feed</a>.</p>
      <p>Feeds include the latest 50 publicly visible records, with links to their evidence and history.
        They can be empty while records await publication. Official-source bibliography entries and fictional Harborview scenarios are excluded. Your reader may keep copies of previously
        public entries after a record is corrected or withdrawn.</p>
      <p>No account or email address is required. Email and webhook subscriptions are managed by
        authorized operators when a delivery provider is configured.</p>
      <Link href="/">Return to the registry</Link>
    </section>
  </main>;
}
