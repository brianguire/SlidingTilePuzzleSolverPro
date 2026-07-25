import AppCSS from './App.module.css';

interface SolutionProps {
    aMoveList: string[];
}

const Solution: React.FC<SolutionProps> = ({ aMoveList }) => {
    const aFormattedList: React.ReactNode[] = aMoveList.map((move, index) => (
        <div key={index}>&gt; {move}&nbsp;&nbsp;&nbsp;&nbsp;</div>
    ));

    return (
        <div>
            Solution:<br />
            <div className={ AppCSS.move }>
            { aFormattedList }
            </div>
        </div>
    );
};

export default Solution;