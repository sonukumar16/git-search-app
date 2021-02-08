## Solution
1.  I have used Typescript to create the project.
2. As per requirement like once we search for a searchTerm then we have to store that so that no need to call api again for the same, 
    So i have used *redux-persist* to achieve this.
3. Used Thunk(*redux-thunk*) to perform the Async task in our store.
4. Using Debounce from lodash to perform delay in our search so that can improve the performance of App.
5. Design :- Plain CSS.


## To run the application 

### `yarn install`
### `yarn start`