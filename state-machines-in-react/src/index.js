/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { useState } from "react";
import ReactDOM from "react-dom";

import "./styles.css";

import { useMachine } from "@xstate/react";
import { Machine } from "xstate";

const toggleMachine = Machine(
  {
    id: "toggle",
    initial: "Idle",
    states: {
      Idle: {
        on: {
          StartCalling: {
            target: "Dialling",
            // transition actions
            actions: ["Dialling", "printTime"]
          },
          IncomingCall: {
            target: "Ringing",
            // transition actions
            actions: ["IncomingCall", "printTime"]
          }
        }
      },
      Dialling: {
        on: {
          remoteRinging: {
            target: "Ringing",
            // transition actions
            actions: ["Ringing", "printTime"]
          }
        }
      },
      Ringing: {
        on: {
          remoteAnswer: {
            target: "Conversation",
            actions: ["remoteAnswer", "printTime"]
          },
          Answered: {
            target: "Conversation",
            actions: ["Answered", "printTime"]
          },
          Timeout: {
            target: "Idle",
            actions: ["Timeout", "printTime"]
          }
        }
      },
      Conversation: {
        on: {
          hangup: {
            target: "Idle",
            // transition actions
            actions: ["Idle", "printTime"]
          },
          Hold: {
            target: "Hold",
            // transition actions
            actions: ["Hold", "printTime"]
          }
        }
      },
      Hold: {
        on: {
          hangup: {
            target: "Idle",
            // transition actions
            actions: ["Idle", "printTime"]
          },
          Unhold: {
            target: "Conversation",
            // transition actions
            actions: ["Unhold", "printTime"]
          }
        }
      }
    }
  },
  {
    actions: {
      // action implementations
      Dialling: (context, event) => {
        console.log("Dialling...");
      },
      Ringing: (context, event) => {
        console.log("Ringing...");
      },
      remoteAnswer: (context, event) => {
        console.log("remoteAnswer...");
      },
      Idle: (context, event) => {
        console.log("Idle...");
      },
      IncomingCall: (context, event) => {
        console.log("IncomingCall...");
      },
      Answered: (context, event) => {
        console.log("Answered...");
      },
      Hold: (context, event) => {
        console.log("Hold...");
      },
      Unhold: (context, event) => {
        console.log("Unhold...");
      },
      Timeout: (context, event) => {
        console.log("Timeout...");
      },
      printTime: (context, event) => {
        console.log("time:", Date.now());
      }
    }
  }
);

const Toggler = () => {
  const [current, send] = useMachine(toggleMachine);

  return (
    <div>
      {current.value}
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <button onClick={() => send("StartCalling")}>StartCalling</button>
      <button onClick={() => send("remoteRinging")}>remoteRinging</button>
      <button onClick={() => send("Timeout")}>Timeout</button>
      <button onClick={() => send("remoteAnswer")}>remoteAnswer</button>
      <button onClick={() => send("hangup")}>hangup</button>
      <br></br>
      <br></br>
      <button onClick={() => send("IncomingCall")}>IncomingCall</button>
      <button onClick={() => send("Timeout")}>Timeout</button>
      <button onClick={() => send("Answered")}>Answered</button>
      <button onClick={() => send("hangup")}>hangup</button>
    </div>
  );
};

const rootElement = document.getElementById("root");
ReactDOM.render(<Toggler />, rootElement);
