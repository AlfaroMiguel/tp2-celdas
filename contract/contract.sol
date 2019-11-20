pragma solidity ^0.5.0;

import "github.com/OpenZeppelin/zeppelin-solidity/contracts/ownership/Ownable.sol";
import "./SafeMath.sol";

contract ProjectFactory is Ownable {
    using SafeMath for uint256;

    enum States { CLOSE, OPEN, CANCELED }
    event newProject(uint id, string name, uint amount);
    event projectStateChanged(uint _projectId, string name, States state);
    
    struct Project {
        string name;
        uint amount;
        uint creationDate;
        uint endDate;
        States state;
        uint moneyFunded;
        address payable[] contributorsAddresses;
        mapping(address => uint) contributors;
    }

    Project[] public projects;

    mapping(uint => address payable) public projectsToOwner;
    mapping(address  => uint) ownerProjectsCount;

    function getProjectCount() public view returns (uint) {
         return projects.length;
    }

    function createProject(string memory _name, uint _amount, uint _days) public {
        address payable[] memory contributors;
        Project memory project = Project(_name, _amount, now, uint(now + _days * 86400), States.OPEN, 0, contributors);
        uint id = projects.push(project) - 1;
        projectsToOwner[id] = msg.sender;
        ownerProjectsCount[msg.sender]++;
        emit newProject(id, _name, _amount);
    }

    function contribute(uint _projectId, uint _amount) public payable {
        projects[_projectId].moneyFunded += _amount;
        projects[_projectId].contributorsAddresses.push(msg.sender);
        projects[_projectId].contributors[msg.sender] += _amount;
        verifyProject(_projectId);
    }
    
    function getMoneyFunded(uint _projectId) public view returns (uint){
        return projects[_projectId].moneyFunded;
    }

    function verifyProject(uint _projectId) public {
        Project storage project = projects[_projectId];
        if(project.moneyFunded >= project.amount) {
            project.state = States.CLOSE;
            projectsToOwner[_projectId].transfer(project.moneyFunded);
        } else if(now > project.endDate) {
            project.state = States.CANCELED;
            for (uint index = 0; index < project.contributorsAddresses.length; index++) {
                address payable contributor = project.contributorsAddresses[index];
                contributor.transfer(project.contributors[contributor]);
            }
        }

        emit projectStateChanged(_projectId, project.name, project.state);
    }
}
