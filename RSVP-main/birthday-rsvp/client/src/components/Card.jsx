import React from 'react'
import styled from 'styled-components'

// Card component based on the provided styled code, adapted to accept children
export default function Card({ children, className }) {
  return (
    <StyledWrapper className={className}>
      <div className="card">
        {children}
      </div>
    </StyledWrapper>
  )
}

const StyledWrapper = styled.div`
  .card {
    /* Premium glass */
    --bg1: rgba(255, 255, 255, 0.10);
    --bg2: rgba(255, 255, 255, 0.04);
    --border: rgba(255, 255, 255, 0.10);
    --inner: rgba(255, 255, 255, 0.08);
    --shadow: 0 24px 70px rgba(0, 0, 0, 0.35);

    position: relative;
    overflow: hidden;
    border-radius: 20px;
    background: linear-gradient(135deg, var(--bg1), var(--bg2));
    border: 1px solid var(--border);
    backdrop-filter: saturate(160%) blur(12px);
    -webkit-backdrop-filter: saturate(160%) blur(12px);
    box-shadow: var(--shadow);
    transition: box-shadow .2s ease, border-color .2s ease, background .2s ease;

    color: rgba(255, 255, 255, 0.88);
    padding: 24px;
    width: 100%;
    max-width: 720px;
    margin: 0 auto;
  }

  /* Dark mode support (Tailwind sets .dark on html) */
  .dark & .card {
    --bg1: rgba(255, 255, 255, 0.10);
    --bg2: rgba(255, 255, 255, 0.04);
    --border: rgba(255, 255, 255, 0.10);
    --inner: rgba(255, 255, 255, 0.08);
    --shadow: 0 24px 70px rgba(0, 0, 0, 0.45);
  }

  /* Disable glow when focusing inputs inside */
  .card:focus-within {
    box-shadow: var(--shadow);
  }

  /* Soft highlight top-left */
  .card::before {
    content: "";
    position: absolute;
    inset: -35% auto auto -35%;
    width: 360px; height: 360px;
    background: radial-gradient(circle at top left, rgba(58,167,255,0.22), transparent 60%);
    pointer-events: none;
    filter: blur(1px);
  }

  /* Inner subtle border for glass edge */
  .card::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 20px;
    box-shadow: inset 0 0 0 1px var(--inner);
    pointer-events: none;
  }
`
