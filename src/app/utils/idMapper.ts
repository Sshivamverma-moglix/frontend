export const getIdbyName = (name: string, arr: any): number => {
    return arr.filter((data: any) => {
        if (data.name === name) return data.id;
        return null;
    })[0]?.id;
}
