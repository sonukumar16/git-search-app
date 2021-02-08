import React, { useEffect, useState, useCallback, } from "react";
import debounce from "lodash/debounce";
import isEmpty from "lodash/isEmpty";
import { useDispatch, useSelector } from "react-redux";

import { fetchFromGit as fetchFromGitAction } from "../../store/actions/gitSearch";
import { TextInput, SelectInput } from "../../components/common";

import "./style.css";
import { get } from "lodash";

interface RootState {
  gitSearchReducer: {
    data: Array<any>;
    isLoading: boolean;
    error: any;
  }
}

const Home: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [entity, setEntity] = useState('');
  const [result, setResult] = useState(null);
  const dispatch = useDispatch();
  const { data, isLoading, error } = useSelector((state: RootState) => state.gitSearchReducer);
  const entities = [{
    text: 'User',
    value: 'user'
  }, {
    text: 'Repository',
    value: 'repository'
  }];

  const isEntityDefault = entity === 'default';
  const isValidInput = searchText.length && !isEntityDefault && entity;
  const searchType = (entity && !isEntityDefault) ? (entity === 'user' ? 'users' : 'repositories') : '';

  const searchedData = searchType && data.find((ele: { searchType: string; searchText: string; data: any }) => ele.searchType === searchType && ele.searchText === searchText);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSearchText(value)
  }

  const handleEntityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setEntity(value)
  }

  const fetchFromGit = useCallback(debounce(async (searchText, searchType) => {
    if (searchText.length >= 3)
      dispatch(fetchFromGitAction(searchType, searchText))
  }, 1000), []);

  useEffect(() => {
    if (entity) {

      if (searchText.length >= 3 && !isEntityDefault) {
        setResult(searchedData);
        if (!searchedData) {
          fetchFromGit(searchText, searchType)
        }

      } else {
        setResult(null);
      }
    }

  }, [searchText, entity, searchedData]);

  const renderUsersCard = () => {
    const data = get(result, 'data', []);
    return (
      <div className="cardsContainer">
        {
          data.map((item: any, index: number) => {
            return <div className="card" key={index}>
              <img src={item.avatar_url} alt="Avatar" style={{ width: "100%" }} />
              <div className="container">
                <h4>User: <b>{item.login}</b></h4>
                <p>location: {item.location} </p>
                <a href={item.html_url} target="_blank" style={{ textDecoration: "none" }} >
                  Profile
                </a>
              </div>
            </div>
          })
        }
      </div>
    )
  }

  const renderReposCard = () => {
    const data = get(result, 'data', []);
    return (
      <div className="cardsContainer">
        {
          data.map((item: any, index: number) => {
            return <div className="card" key={index}>
              <h4>Name: {item.name}</h4>
              <h4> Author: <b> {item.owner?.login}</b></h4>
              <p>stars: {item.stargazers_count}</p>
              <p>Open Issues: {item.open_issues}</p>
              <a href={item.html_url} target="_blank" style={{ textDecoration: "none" }} >
                Repository
                </a>
            </div>
          })
        }
      </div>

    )
  }

  const loadingOrNoData = () => {
    let content = '';
    if (isLoading) {
      content = "Loading...";
    } else if (result && isEmpty(result.data)) {
      content = "No data found"
    } 
    return content ? (<div className={"loadingOrError"}>{content}</div>) : null;
  }

  return (
    <div className={isValidInput ? "homeContainer" : "homeContainerCenter"}>
      <h1 className="heading">Github search application</h1>
      <div className={isValidInput ? "inputsWrapper" : "inputsWrapperCenter"}  >

        <SelectInput
          name="entity"
          placeholder="Select entity"
          onChange={handleEntityChange}
          value={entity}
          defaultOption="Select entity"
          options={entities}
          className="selectWrapper"
          inputClass="inputSelect"
        />

        <TextInput
          name="search"
          placeholder="Search in github"
          onChange={handleSearchChange}
          value={searchText}
          inputClass="inputText"
          className='selectWrapper'
        />
      </div>

      { loadingOrNoData() || (entity === "user" ? renderUsersCard() : renderReposCard())}
    </div>
  )

}

export default Home;