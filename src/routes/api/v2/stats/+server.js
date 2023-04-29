import { hygraphOnSteroids } from '$lib/server/hygraph'
import { gql } from 'graphql-request'
import { responseInit } from '$lib/server/responseInit'

export async function GET({ url }) {
    const first = Number(url.searchParams.get('first') ?? 5)
    const skip = Number(url.searchParams.get('skip') ?? 0)
    // Game id
    const id = Number(url.searchParams.get('id')) || null
    const query = queryGetStats(id)
    const data = await hygraphOnSteroids.request(query, { first, skip, id })
    
    return new Response(JSON.stringify(data), responseInit)
}

function queryGetStats(id){
    // If id is not null, return game stats with id
    if (id !== null) {
        return gql`
            query getStats($first: Int, $skip: Int, $id: Int){
                stats(first: $first, skip: $skip, where: {game: {gameId: $id}}){
                    game {
                        gameId
                    }
                    team1Score
                    team2Score 
                }
            }
        `
    }
    // If id is null, return all game stats
    else{
        return gql`
            query getStats($first: Int, $skip: Int){
                stats(first: $first, skip: $skip){
                    game {
                        gameId
                    }
                    team1Score
                    team2Score 
                }
            }
        `
    }
    
}