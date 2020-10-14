import React from 'react';
import 'react-router-dom';
import { withRouter, Redirect } from 'react-router-dom'; // withRouter gives access to 'location' https://stackoverflow.com/questions/53539314/what-is-withrouter-for-in-react-router-dom
import '../styling/Commits.css';
import Header from './Header.js';
import formatDate from '../utilities/formatDate.js';
import '../styling/Loading.css';

class Commits extends React.Component {
    constructor(props) {
        super(props);
     
        this.state = {
            redirect: null,
            error: null,
            loaded: false,
            repo_name: "",
            commits_data: [],
        };
    }

    isNull(obj){
        return obj === null;
    }

    componentDidMount(){
        if(!this.props.location.state) {
            this.setState({
                redirect:true,
            })
            return
        }
        let { repo_name, commits_url } = this.props.location.state;

        var indexOfSha = commits_url.indexOf("{/sha}")// I can either search for the string '{/sha' or '/commits'
        if(indexOfSha !== -1){
            commits_url = commits_url.substr(0,indexOfSha)
        }

        fetch(commits_url)
            .then(response => response.json())
            .then(retrievedData => {
                for (var i = 0, l = retrievedData.length; i < l; i++) {
                    var tempObj = {// potential issue. Data is fine for netflix repo. 
                        id: retrievedData[i].node_id,
                        username: this.isNull(retrievedData[i].author) ? "N/A" : retrievedData[i].author.login,
                        title: retrievedData[i].commit.message,
                        hash: retrievedData[i].sha,
                        date: formatDate(retrievedData[i].commit.committer.date),
                    }
                    retrievedData[i] = tempObj
                }
                this.setState({ 
                    loaded:true,
                    commits_data: retrievedData
                });
            },(error) => {
                this.setState({
                    loaded: true,
                    error
                });
            } 
        );     

        this.setState({
            loaded: true,
            repo_name: repo_name
        })
    }

    render(){
        if(this.state.redirect) {
            return <Redirect to="/" />
        } 
        const { error, loaded } = this.state
        if(error){
            return <div>Error: {error.message}</div>;
        } else if (!loaded){
            return <div className="loading">Loading ...</div>;
        } else {
            const { repo_name, commits_data } = this.state

            return (
                <div>
                    <Header title={"Commits for "+ repo_name}></Header>
                    {commits_data.map(obj => 
                        <div key={obj.id} className='commitsContainer'>
                            <div className="space">
                                <h1>{obj.username}</h1>
                                <h1>{obj.date}</h1>
                            </div>
                            
                            <p>Title: {obj.title}</p>
                            <p>Hash: {obj.hash}</p>
                        </div>
                    )}
                </div>
            );
        }
    }
}

export default withRouter(Commits);