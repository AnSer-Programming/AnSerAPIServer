import Graph from '../components/Graph.tsx';
import logo from '../assets/img/AnSerLogo2.png';

const AgentStats = () => {
  return (
    <>
      <div className='text-light bg-dark text-center mainBody' style={{paddingLeft: '5px', paddingRight: '5px'}}>
        <img src={logo} alt='Logo' className="mr-3"/> <br /><br /><br />
      </div>
      <Graph />
    </>
  );
};

export default AgentStats;