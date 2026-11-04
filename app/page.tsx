"use client";

import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [prompt, setPrompt] = useState("");
  const [negative, setNegative] = useState(
    "jitter, blur, distortion, flicker, unnatural movement"
  );
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [video, setVideo] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!file) {
      setPreview("");
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  function chooseFile(next: File | undefined) {
    if (!next) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(next.type)) {
      setError("Please choose a JPG, PNG or WebP image.");
      return;
    }

    if (next.size > 10 * 1024 * 1024) {
      setError("Image size must be 10 MB or less.");
      return;
    }

    setError("");
    setVideo("");
    setFile(next);
  }

  async function generate() {
    if (!file) {
      setError("Upload an image first.");
      return;
    }

    if (prompt.trim().length < 5) {
      setError("Write a more detailed video prompt.");
      return;
    }

    setBusy(true);
    setError("");
    setVideo("");
    setStatus("Uploading image…");

    try {
      const body = new FormData();
      body.append("image", file);
      body.append("prompt", prompt.trim());
      body.append("negativePrompt", negative.trim());

      setStatus("Sending request to the AI video engine…");

      const response = await fetch("/api/generate", {
        method: "POST",
        body,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Video generation failed.");
      }

      if (!data.videoUrl) {
        throw new Error("The AI provider did not return a video URL.");
      }

      setVideo(data.videoUrl);
      setStatus("Your video is ready.");
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Something went wrong."
      );
      setStatus("");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="shell">
      <header className="topbar">
        <a className="brand" href="#">
          <span className="brand-mark">✦</span>
          <span>
            Shuvo<span className="brand-light">AI</span>
            <small> AI STUDIO</small>
          </span>
        </a>
        <nav>
          <a className="active" href="#studio">Create</a>
          <a href="#how">How it works</a>
          <a href="#pricing">Pricing</a>
        </nav>
        <a className="top-cta" href="#studio">
          Start creating <span>↗</span>
        </a>
      </header>

      <section className="hero">
        <div className="eyebrow">
          <span className="pulse" /> AI VIDEO GENERATION STUDIO
        </div>
        <h1>
          Bring your images
          <br />
          <em>to life.</em>
        </h1>
        <p className="hero-copy">
          Turn a single image into a cinematic video. Describe the motion,
          let AI do the magic.
        </p>
        <div className="hero-tags">
          <span>✦ Image to video</span>
          <span>◷ AI-powered</span>
          <span>↗ Download MP4</span>
        </div>
      </section>

      <section className="studio-grid" id="studio">
        <div className="panel editor">
          <div className="panel-heading">
            <div>
              <span className="step">01</span>
              <h2>Start with an image</h2>
            </div>
            <span className="muted">JPG · PNG · WEBP</span>
          </div>

          <div
            className={`upload ${preview ? "has-image" : ""}`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              chooseFile(e.dataTransfer.files[0]);
            }}
            onClick={() => inputRef.current?.click()}
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              hidden
              onChange={(e) => chooseFile(e.target.files?.[0])}
            />

            {preview ? (
              <>
                <img src={preview} alt="Selected image preview" />
                <button
                  className="replace"
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    inputRef.current?.click();
                  }}
                >
                  Replace image
                </button>
              </>
            ) : (
              <div className="upload-empty">
                <div className="upload-icon">＋</div>
                <strong>Drop your image here</strong>
                <span>or click to browse files</span>
                <small>Maximum file size: 10 MB</small>
              </div>
            )}
          </div>

          <div className="field-head">
            <label htmlFor="prompt">02 &nbsp; Describe your video</label>
            <span className="muted">Be descriptive</span>
          </div>

          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="A gentle breeze moves through her hair. The camera slowly pushes in as warm sunlight flickers across the scene…"
            rows={5}
          />

          <div className="field-head">
            <label htmlFor="negative">
              Negative prompt <span className="optional">OPTIONAL</span>
            </label>
          </div>

          <input
            id="negative"
            className="text-input"
            value={negative}
            onChange={(e) => setNegative(e.target.value)}
          />

          <div className="note">
            <span>ⓘ</span> Write what should move, how it should move,
            and the camera motion.
          </div>

          {error && <div className="error">{error}</div>}

          <button
            className="generate"
            disabled={busy}
            onClick={generate}
          >
            {busy ? (
              <>
                <span className="spinner" /> Generating video…
              </>
            ) : (
              <>✦ &nbsp; Generate video <span className="arrow">→</span></>
            )}
          </button>

          <p className="secure">
            Your API key stays private on the server. Generation may use
            paid AI credits.
          </p>
        </div>

        <div className="panel result-panel">
          <div className="panel-heading">
            <div>
              <span className="step">03</span>
              <h2>Your creation</h2>
            </div>
            <span className="live"><i /> LIVE PREVIEW</span>
          </div>

          <div className="result-stage">
            {video ? (
              <video
                src={video}
                controls
                playsInline
                className="result-video"
              />
            ) : (
              <div className="result-empty">
                <div className="orbit"><span>✦</span></div>
                <strong>
                  {busy ? "Creating your video" : "Your video will appear here"}
                </strong>
                <p>
                  {busy
                    ? "The AI model is working on your image. This can take a few minutes."
                    : "Upload an image and write a prompt to begin."}
                </p>
                {busy && <div className="progress"><span /></div>}
              </div>
            )}
          </div>

          <div className="result-footer">
            <div>
              <span className="result-label">GENERATION STATUS</span>
              <strong>{status || "Waiting for your prompt"}</strong>
            </div>
            {video && (
              <a
                className="download"
                href={video}
                target="_blank"
                rel="noreferrer"
                download
              >
                ↓ Download MP4
              </a>
            )}
          </div>

          <div className="result-hint">
            <span>✧</span>
            <p>
              Tip: Specific, natural movement usually produces more
              convincing results.
            </p>
          </div>
        </div>
      </section>

      <section className="how" id="how">
        <div className="section-kicker">SIMPLE WORKFLOW</div>
        <h2>From still to <em>cinematic.</em></h2>
        <div className="how-grid">
          <article>
            <b>01</b>
            <div className="how-icon">▧</div>
            <h3>Upload</h3>
            <p>Choose a clear image that you want to animate.</p>
          </article>
          <article>
            <b>02</b>
            <div className="how-icon">✎</div>
            <h3>Describe</h3>
            <p>Tell the AI what should move and how the scene should feel.</p>
          </article>
          <article>
            <b>03</b>
            <div className="how-icon">▶</div>
            <h3>Generate</h3>
            <p>Let the AI model create your video, then preview and download it.</p>
          </article>
        </div>
      </section>

      <footer>
        <a className="brand" href="#">
          <span className="brand-mark">✦</span>
          <span>Shuvo<span className="brand-light">AI</span><small> AI STUDIO</small></span>
        </a>
        <span>© 2026 Shuvo AI Studio.</span>
        <span className="footer-note">AI-generated content may contain errors.</span>
      </footer>
    </main>
  );
}
