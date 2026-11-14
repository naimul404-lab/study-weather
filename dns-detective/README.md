# DNS Detective

An interactive, browser-only DNS lookup simulator that shows how a domain name can be resolved through recursive, root, TLD, and authoritative DNS servers.

## Run it

Open `index.html` directly in a modern browser, or serve this directory with a local static server:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000/dns-detective/` from the repository root.

## What it demonstrates

- A browser checks its local DNS cache.
- A recursive resolver coordinates the lookup.
- Root DNS points the resolver toward the relevant top-level domain.
- The TLD server points toward the domain's authoritative nameserver.
- The authoritative nameserver returns an example address record.

This is an educational simulation. It does not send DNS queries or claim to report live DNS records. The example address is generated locally for demonstration.

## Deploy with GitHub Pages

In the existing repository's **Settings → Pages**, publish from the `main` branch and `/ (root)`. Once Pages has deployed, open:

`https://naimul404-lab.github.io/study-weather/dns-detective/`
