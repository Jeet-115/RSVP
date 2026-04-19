import React from 'react'
import styled from 'styled-components'

// High-contrast neo-inputs based on provided style
export function TextInput({ className = '', ...props }) {
  return (
    <StyledWrapper>
      <div className={`input-container ${className}`}>
        <input className="input" type="text" {...props} />
      </div>
    </StyledWrapper>
  )
}

export function TextArea({ className = '', rows = 3, ...props }) {
  return (
    <StyledWrapper>
      <div className={`input-container ${className}`}>
        <textarea className="input textarea" rows={rows} {...props} />
      </div>
    </StyledWrapper>
  )
}

const StyledWrapper = styled.div`
  .input-container { position: relative; width: 100%; max-width: 720px; }

  .input {
    width: 100%;
    height: 52px;
    padding: 12px 14px;
    font-size: 15px;
    font-family: inherit;
    color: rgba(255, 255, 255, 0.92);
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.10);
    border-radius: 14px;
    outline: none;
    transition: border-color 0.15s ease, background 0.15s ease, box-shadow 0.15s ease;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }

  .textarea { height: auto; min-height: 110px; resize: vertical; }

  .input::placeholder {
    color: rgba(255, 255, 255, 0.45);
  }

  .input:hover {
    background: rgba(255, 255, 255, 0.075);
    border-color: rgba(255, 255, 255, 0.16);
  }

  .input:focus {
    background: rgba(255, 255, 255, 0.085);
    border-color: rgba(58, 167, 255, 0.55);
    box-shadow: 0 0 0 4px rgba(58, 167, 255, 0.18);
  }
`;
