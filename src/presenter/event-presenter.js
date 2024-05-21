import EventListView from '../view/event-list-view';
import EventView from '../view/event-view';
import SortView from '../view/sort-view';
import { render, replace } from '../framework/render';
import EditEventView from '../view/event-edit-view';
import EmptyListView from '../view/empty-list-view';
import { isEmpty } from '../utils';

export default class EventPresenter {
  #container = null;
  #eventModel = null;
  #eventListComponent = null;

  constructor({ container, eventModel }) {
    this.#container = container;
    this.#eventModel = eventModel;
    this.#eventListComponent = new EventListView();
  }

  init() {
    this.#renderEventListView(this.#eventModel);
  }

  #renderSortView() {
    render(new SortView({sortTypes: this.#eventModel.sortTypes, currentSortType: this.#eventModel.sortTypes[0]}), this.#container);
  }

  #renderEmptyView() {
    render(new EmptyListView({filterTypes: this.#eventModel.filterTypes[0]}), this.#container);
  }

  #renderEventListView() {
    const events = this.#eventModel.events;

    if (isEmpty(events)) {
      this.#renderEmptyView();
      return;
    }

    this.#renderSortView();
    render(this.#eventListComponent, this.#container);
    events.forEach((event) => this.#renderEventItemView(event));
  }

  #renderEventItemView(event) {
    const destinations = this.#eventModel.destinations;
    const offers = this.#eventModel.offers;

    const onEscKeydown = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        switchToViewMode();
      }
    };

    const onEditClick = () => switchToEditMode();
    const onFormSubmit = () => switchToViewMode();
    const onFormCancel = () => switchToViewMode();

    const eventItemView = new EventView({
      event,
      offers,
      destinations,
      onEditClick: onEditClick,
    });

    const editEventView = new EditEventView({
      event,
      offers,
      destinations,
      onFormSubmit: onFormSubmit,
      onFormCancel: onFormCancel,
    });

    function switchToEditMode() {
      replace(editEventView, eventItemView);
      document.addEventListener('keydown', onEscKeydown);
    }
    function switchToViewMode() {
      replace(eventItemView, editEventView);
      document.removeEventListener('keydown', onEscKeydown);
    }
    render(eventItemView, this.#eventListComponent.element);
  }
}