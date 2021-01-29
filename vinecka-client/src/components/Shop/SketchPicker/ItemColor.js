import React from "react";
import Button from "react-bootstrap/Button";
import Popover from "react-bootstrap/Popover";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";

import { SketchPicker } from "react-color";

import { GiPalette } from "react-icons/gi";

export default ({ setShowItemsColor, setItemsColor, itemsColor }) => {
  const handleItemsColor = (color) => {
    setItemsColor(color.hex);
  };
  return (
    <OverlayTrigger
      trigger="click"
      placement="right"
      overlay={
        <Popover style={{ backgroundColor: "#333333" }}>
          <Popover.Content>
            <SketchPicker
              disableAlpha
              color={itemsColor}
              onChangeComplete={handleItemsColor}
            />
          </Popover.Content>
        </Popover>
      }
    >
      <Button size="sm" variant="light" onClick={() => setShowItemsColor(true)}>
        <GiPalette
          style={{ fontSize: "150%", marginBottom: "3px", marginTop: "2px" }}
        />
      </Button>
    </OverlayTrigger>
  );
};

