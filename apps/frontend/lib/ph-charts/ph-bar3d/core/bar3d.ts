import { multiply } from "mathjs";

const baseMatrix = [
    [-Math.cos(42 * Math.PI / 180) / 2, Math.cos(-7 * Math.PI / 180), 0],
    [-Math.sin(42 * Math.PI / 180) / 2, Math.sin(-7 * Math.PI / 180), -1]
];

const faceVectors = [
    [[0, 0, 0], [1, 0, 0], [1, 0, 1], [0, 0, 1]],
    [[0, 0, 0], [0, 0, 1], [0, 1, 1], [0, 1, 0]],
    [[0, 0, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1]]
]



export class Bar3D {
    public static getFaces(data: {x:  number, y: number, height: number, size: number }): string[] {
        const faces = [];

        for (const vectors of faceVectors) { 
            const points = vectors.map(vector => this.project([data.x + vector[0] * data.size, data.y + vector[1] * data.size, vector[2] * data.height])).join("");
            faces.push(points);
        }

        return faces;
    }

    private static project(point: any): string {
        const res = multiply(baseMatrix, point) as any;
        return `${res[0]}, ${res[1]} `
    }
}