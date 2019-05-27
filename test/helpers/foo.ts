import {Rds} from "../../src/rds";
import {Project} from "./models/project";

const rds = new Rds();
rds.config([
    {name: 'Project', model: Project}
]);

const projectRds = rds.getObjectContainer().findPretty('Project').instanceController();
projectRds.add([
    {id: 1, name: 'project-1'},
    {id: 2, name: 'project-2'},
    {id: 3, name: 'project-3'}
]);

export const testProjectRds = projectRds;

// export const sum
//     = (...a: number[]) =>
//     a.reduce((acc, val) => acc + val, 0);
