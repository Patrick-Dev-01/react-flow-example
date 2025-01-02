import { useContext } from "react";
import DnDContext from "../context/dnd/DndContext";

export const useDnD = () => {
    return useContext(DnDContext);
  }