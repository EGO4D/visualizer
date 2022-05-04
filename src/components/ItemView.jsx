import React from "react";
import { useMephistoReview } from "../shims/mephisto-review-hook";
import { useParams, Link, useSearchParams } from "react-router-dom";
import {
  Button,
  Navbar,
  NavbarGroup,
  NavbarDivider,
  NavbarHeading,
  Spinner,
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
                    <b>Ego4D Explorer</b>
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
            <h1 className="item-view-message"><Spinner /> Loading...</h1>
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
              <h1 className="item-view-message">Error loading data</h1>
            </div>
          </div>
        )}
      </main>
    </>
  );
}

export default ItemView;
