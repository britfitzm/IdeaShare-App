import IdeasAPI from '../services/ideasAPI';
import IdeaList from './IdeaList';

class IdeaForm {
	constructor() {
		this._formModal = document.getElementById('form-modal');
		this.render();
		this._ideaList = new IdeaList();
	}

	eventListeners() {
		this._form.addEventListener('submit', this.handleSubmit.bind(this));
	}

	async handleSubmit(e) {
		e.preventDefault();

		/* form validation client side */
		const usernameDiv = document.querySelector('.username-div');
		const textDiv = document.querySelector('.text-div');
		const tagDiv = document.querySelector('.tag-div');

		/* remove any existing error messages */
		this.removeErrorMessages();

		const errMsg = document.createElement('div');
		errMsg.classList.add('error-message');

		if (!this._form.elements.username.value) {
			errMsg.innerHTML = `Please Enter Your Username`;
			usernameDiv.appendChild(errMsg);
			return;
		}

		if (!this._form.elements.text.value) {
			errMsg.innerHTML = `Please Write Your Idea`;
			textDiv.appendChild(errMsg);
			return;
		}

		if (!this._form.elements.tag.value) {
			errMsg.innerHTML = `Please Select a Tag`;
			tagDiv.appendChild(errMsg);
			return;
		}

		/* save user to local storage */
		localStorage.setItem('username', this._form.elements.username.value);

		const idea = {
			username: this._form.elements.username.value,
			text: this._form.elements.text.value,
			tag: this._form.elements.tag.value,
		};

		const ideasAPI = new IdeasAPI();

		try {
			/* call the createIdea method on the instance, not on the class itself */
			const newIdea = await ideasAPI.createIdea(idea);

			/* add idea to list */
			this._ideaList.addIdeatoList(newIdea.data.data);

			/* clear form inputs */
			this._form.elements.username.value = '';
			this._form.elements.text.value = '';
			this._form.elements.tag.value = '';

			this.render();

			document.dispatchEvent(new Event('closeForm'));
		} catch (error) {
			console.log('Error While Creating Idea:', error);
		}
	}

	removeErrorMessages() {
		const errMsgElements = document.querySelectorAll('.error-message');
		errMsgElements.forEach((errMsgElement) => {
			errMsgElement.remove();
		});
	}

	render() {
		this._formModal.innerHTML = `
        <form id="idea-form">
        <div class="form-control username-div">
          <label for="idea-text">Enter a Username</label>
          <input type="text" name="username" id="username" value="${
						localStorage.getItem('username')
							? localStorage.getItem('username')
							: ''
					}"/>
        </div>
        <div class="form-control text-div">
          <label for="idea-text">What's Your Idea?</label>
          <textarea name="text" id="idea-text"></textarea>
        </div>
        <div class="form-control tag-div">

          <label for="tag">Choose a Tag:</label>
            <select name="tag" id="tag">
                <option value="" disabled selected>Select a Tag</option>
                <option value="business">Business</option>
                <option value="technology">Technology</option>
                <option value="software">Software</option>
                <option value="health">Health</option>
                <option value="inventions">Inventions</option>
                <option value="education">Education</option>
                <option value="others">Others</option>
            </select>

        </div>
        <button class="btn" type="submit" id="submit">Submit</button>
      </form>
        `;
		this._form = document.getElementById('idea-form');
		this.eventListeners();
	}
}

export default IdeaForm;
