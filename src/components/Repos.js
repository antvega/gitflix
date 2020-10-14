import React from 'react';
import { Component } from 'react';
import { Link } from "react-router-dom";
import '../styling/Repos.css';
import Header from './Header.js';
import formatDate from '../utilities/formatDate.js';
import '../styling/Loading.css';

class Repos extends Component {
    constructor(props) {
      super(props);
   
      this.state = {
        error: null,
        loaded: false,
        data: [],
      };
    }
    
    componentDidMount() {
      fetch('https://api.github.com/orgs/Netflix/repos')
        .then(response => response.json())
        .then(
            (retrievedData) => {
                for (var i = 0, l = retrievedData.length; i < l; i++) {
                    var tempObj = { // potential issue.
                        id: retrievedData[i].id,
                        name: retrievedData[i].name,
                        language: retrievedData[i].language,
                        description: retrievedData[i].description,
                        pushed_at: formatDate(retrievedData[i].pushed_at),
                        commits_url: retrievedData[i].commits_url,
                        star_count: retrievedData[i].stargazers_count,
                        forks_count: retrievedData[i].forks_count,
                    }
                    retrievedData[i] = tempObj
                }
                var byStarCount = retrievedData.slice(0);
                byStarCount.sort(function(a,b) {
                    return a.star_count - b.star_count;
                });
                this.setState({ 
                    data: byStarCount,
                    loaded: true
                })
            }, 
            (error) => {
                this.setState({
                    loaded: true,
                    error
                });
            }
        );
    }  
    
    render() {
        const { error, loaded } = this.state;
        if(error){
            return <div>Error: {error.message}</div>;
        } else if (!loaded){
            return <div className="loading">Loading ...</div>;
        } else {
            const { data } = this.state;
            return (
                <div>
                    <Header title="Netflix Repos"></Header>
                    {data.map(obj =>
                        <div key={obj.id} className="RepoContainer" >
                        <div className="space"> 
                            <h1>{obj.name} </h1>
                            <h1>{obj.pushed_at}</h1>
                        </div>
                        <p>Star Count: {obj.star_count}</p>
                        <p>Fork Count: {obj.forks_count}</p>                        
                        <p>Language: {obj.language}</p>
                        <p>Description: {obj.description}</p>
                        <Link to={{
                            pathname:"/commits", 
                            state: {
                                repo_name: obj.name,
                                commits_url: obj.commits_url
                            }
                        }}>Commits</Link>
                        <p></p>
                    </div>
                    )}
                </div>
            );
        }
    }
}

export default Repos;