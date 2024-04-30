import { AppActions } from "./AppActions";
import { initialState } from "./AppStore";
import { reorderSecondArray } from "@/utils/array";

export const AppReducer = (state, action) => {
  switch (action.type) {
    case AppActions.SET_URL:
      return { ...state, url: action.payload };
    case AppActions.SET_TITLE:
      return { ...state, title: action.payload };
    case AppActions.SET_SLIDE_SIZE:
      return { ...state, slideSize: action.payload };
    case AppActions.SET_THUMBS:
      return { ...state, thumbs: action.payload };
    case AppActions.SET_SLIDES:
      return { ...state, slides: action.payload };
    case AppActions.SET_INVALID_URL:
      return { ...state, invalidUrl: action.payload };
    case AppActions.SET_SELECTED_SLIDES:
      return { ...state, selected_slides: action.payload };
    case AppActions.TOGGLE_SLIDE:
      return {
        ...state,
        selected_slides: state.selected_slides.includes(action.payload)
          ? state.selected_slides.filter((slide) => slide !== action.payload)
          : reorderSecondArray(state.slides, [
              ...state.selected_slides,
              action.payload,
            ]),
      };
    case AppActions.SET_SELECTION_MODE:
      return { ...state, selection_mode: action.payload };
    case AppActions.RESET:
      return initialState;
    default:
      return state;
  }
};
