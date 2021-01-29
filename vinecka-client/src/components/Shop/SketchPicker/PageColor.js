import React from "react";
import Button from "react-bootstrap/Button";
import Popover from "react-bootstrap/Popover";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";

import { SketchPicker } from "react-color";

import { GiPalette } from "react-icons/gi";

export default ({ setShowPageColor, setPageColor, pageColor }) => {
  const handlePageColor = (color) => {
    setPageColor(color.hex);
  };
  return (
    <OverlayTrigger
      trigger="click"
      placement="left"
      overlay={
        <Popover style={{ backgroundColor: "#333333" }}>
          <Popover.Content>
            <SketchPicker
              disableAlpha
              color={pageColor}
              onChangeComplete={handlePageColor}
            />
          </Popover.Content>
        </Popover>
      }
    >
      <Button size="sm" variant="light" onClick={() => setShowPageColor(true)}>
        <GiPalette
          style={{ fontSize: "150%", marginBottom: "3px", marginTop: "2px" }}
        />
      </Button>
    </OverlayTrigger>
  );
};

/*
 */
