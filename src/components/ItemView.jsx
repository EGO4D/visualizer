// Copyright (c) Meta Platforms, Inc. and affiliates. All Rights Reserved.

import React from "react";
import { useMephistoReview } from "../shims/mephisto-review-hook";
import { useParams, Link, useSearchParams } from "react-router-dom";
import {
  Button,
  Navbar,
  NavbarGroup,
  NavbarDivider,
  NavbarHeading,
  Alignment,
  Position,
  Toaster,
} from "@blueprintjs/core";
import { JSONItem } from "../renderers/JSONItem";
import { getHostname } from "../utils";
import ErrorPane from "./ErrorPane";
import VersionHeader from "./VersionHeader";

// const AppToaster = Toaster.create({
//   className: "recipe-toaster",
//   position: Position.TOP,
// });

function ItemView({
  itemRenderer: ItemRenderer = JSONItem,
  wrapClass,
}) {
  const { id } = useParams();
  const [searchParams,] = useSearchParams();
  const {
    data: item,
    isFinished,
    isLoading,
    error,
    mode,
  } = useMephistoReview({ taskId: id, hostname: getHostname() });

  return (
    <>
      <VersionHeader />
      <Navbar fixedToTop={true} className="navbar-wrapper">
          <NavbarGroup>
            {mode === "ALL" ? (
              <>
                <Link to={`/?${searchParams.toString()}`} style={{ textDecoration: "none" }}>
                  <Button intent="primary" icon="caret-left" id="home-button">
                    <b>Ego4D Dataset</b>
                  </Button>
                </Link>
                <NavbarDivider />
              </>
            ) : null}
            <NavbarHeading className="navbar-header">
              {mode === "ALL" ? (
                <b>Viewing video: {id}</b>
              ) : (
                <b>Loading video: {id}</b>
              )}
            </NavbarHeading>
          </NavbarGroup>
      </Navbar>
      <main className={`item-view mode-${mode}`}>
        {isLoading ? (
          <div className="item-dynamic">
            <ErrorPane error={error} />
            <h1 className="item-view-message">Loading...</h1>
          </div>
        ) : isFinished ? (
          <div className="item-dynamic">
            <ErrorPane error={error} />
            <h1 className="item-view-message">
              Done reviewing! You can close this app now
            </h1>
          </div>
        ) : item ? (
          wrapClass ? (
            <div className={wrapClass}>
              <ErrorPane error={error} />
              <ItemRenderer item={item} />
            </div>
          ) : (
            <>
              <ErrorPane error={error} />
              <ItemRenderer item={item} />
            </>
          )
        ) : (
          <div className="item-dynamic">
            <div className="item-view-message item-view-no-data">
              <ErrorPane error={error} />
              <h3>
                Thanks for using the <code>$ mephisto review</code> interface.
                Here are a few ways to get started:
              </h3>
              <h3>
                1. Review data from a .csv or{" "}
                <a href="https://jsonlines.org/">.jsonl</a> file
              </h3>
              <pre>
                $ cat sample-data<span className="highlight">.json</span> |
                mephisto review review-app/build/{" "}
                <span className="highlight">--json</span> --stdout
              </pre>
              <pre>
                $ cat sample-data<span className="highlight">.csv</span> |
                mephisto review review-app/build/{" "}
                <span className="highlight">--csv</span> --stdout
              </pre>
              <h3>2. Review data from the Mephisto database</h3>
              <pre>
                $ mephisto review review-app/build/{" "}
                <span className="highlight">--db mephisto_db_task_name</span>{" "}
                --stdout
              </pre>
            </div>
          </div>
        )}
      </main>
    </>
  );
}

export default ItemView;
