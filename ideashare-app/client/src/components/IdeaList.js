import IdeasAPI from '../services/ideasAPI';

class IdeaList {
	constructor() {
		this._ideaListEl = document.getElementById('idea-list');
		this._ideas = [];

		this._ideasAPI = new IdeasAPI();

		this.getIdeas();

		this._validTags = new Set();
		this._validTags.add('technology');
		this._validTags.add('software');
		this._validTags.add('business');
		this._validTags.add('inventions');
		this._validTags.add('health');
		this._validTags.add('education');
	}

	eventListeners() {
		this._ideaListEl.addEventListener('click', (e) => {
			if (e.target.classList.contains('fa-times')) {
				e.stopImmediatePropagation();
				const ideaID = e.target.parentElement.parentElement.dataset.id;
				this.deleteIdea(ideaID);
			}
		});

        /* this._ideaListEl.addEventListener('dblclick', (e) => {
		if (e.target.classList.contains('idea-text')){
			e.stopImmediatePropagation();
		 		const ideaID = e.target.parentElement.dataset.id;
		 		this.editIdea(ideaID);
		}
	   }); */
	}

	async getIdeas() {
		try {
			const res = await this._ideasAPI.getIdeas();
			this._ideas = res.data.data;
			this.render();
		} catch (error) {
			console.log(error);
		}
	}

	async deleteIdea(ideaID) {
		try {
			await this._ideasAPI.deleteIdea(ideaID);

			this._ideas = this._ideas.filter((idea) => idea._id !== ideaID);

			this.getIdeas();
		} catch (error) {
			alert('You are not allowed to delete this post');
			console.log(error);
		}
	}

    /* async editIdea(ideaID) {
         try {
           const ideaToEdit = this._ideas.find((idea) => idea._id === ideaID);
      
           if (!ideaToEdit) {
             console.log('Idea not found for editing');
             return;
           }
      
           const editForm = document.createElement('form');
           editForm.innerHTML = `
             <div class="form-control">
               <label for="edit-idea-text">Edit Your Idea</label>
               <textarea name="edit-idea-text" id="edit-idea-text">${ideaToEdit.text}</textarea>
             </div>
             <div class="form-control">
               <label for="edit-tag">Edit Tag</label>
               <input type="text" name="edit-tag" id="edit-tag" value="${ideaToEdit.tag}" />
             </div>
             <button class="btn" type="submit" id="submit-edit">Save</button>
           `;
      
           const ideaTextElement = this._ideaListEl.querySelector(
             `[data-id="${ideaID}"] .idea-text`
           );
           ideaTextElement.innerHTML = '';
           ideaTextElement.appendChild(editForm);
      
           editForm.addEventListener('submit', async (e) => {
             e.preventDefault();
      
             const editedIdea = {
               text: editForm.elements['edit-idea-text'].value,
               tag: editForm.elements['edit-tag'].value,
               username: localStorage.getItem('username'),
             };
      
             try {
               if (!isValidObjectId(ideaID)) {
                 console.log('Invalid ideaID:', ideaID);
                 return;
               }
      
               const res = await this._ideasAPI.updateIdea(ideaID, editedIdea);
      
               const updatedIdea = res.data.data;
               this._ideas = this._ideas.map((idea) => (idea._id === ideaID ? updatedIdea : idea));
      
               this.render();
             } catch (error) {
               console.log('Error while updating the idea:', error);
               alert('Error while updating the idea. Please try again later.');
             }
           });
         } catch (error) {
           console.log('Error while editing the idea:', error);
         }
       } */
      
	addIdeatoList(idea) {
		this._ideas.push(idea);
		this.render();
	}

	getTagClass(tag) {
		tag = tag.toLowerCase();
		let tagClass = '';
		if (this._validTags.has(tag)) {
			tagClass = `tag-${tag}`;
		} else {
			tagClass = '';
		}
		return tagClass;
	}

	render() {
		this._ideaListEl.innerHTML = this._ideas
			.map((idea) => {
				const tagClass = this.getTagClass(idea.tag);
				const deleteBtn =
					idea.username === localStorage.getItem('username')
						? `<button class="delete"><i class="fas fa-times"></i></button>`
						: '';
				return `
            <div class="card" data-id="${idea._id}">
          ${deleteBtn}
          <h3 class="idea-text">
            ${idea.text}
          </h3>
          <p class="tag ${tagClass}">${idea.tag.toUpperCase()}</p>
          <p>
            Posted on <span class="date">${idea.date}</span> by
            <span class="author">${idea.username}</span>
          </p>
        </div>
            `;
			})
			.join('');

		this.eventListeners();
	}
}

export default IdeaList;
