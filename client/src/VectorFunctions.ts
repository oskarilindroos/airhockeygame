export const VectorFunctions = {
    angle: (xComponent: number, yComponent: number): number => {
        let angle = (Math.atan(xComponent/(yComponent * -1)));
        if (xComponent < 0){
            angle -= Math.PI;
        }
        return angle;
    },

    magnitude: (xComponent: number, yComponent: number): number =>{
        return Math.sqrt(Math.pow(xComponent, 2) + Math.pow(yComponent, 2));
    },

    xComponent: (angle: number, magnitude: number) : number =>{
        return Math.cos(angle) * magnitude;
    },

    yComponent: (angle: number, magnitude: number) : number =>{
        return Math.sin(angle) * magnitude * -1;
    }
};



