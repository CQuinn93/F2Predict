import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import { CountryFlag } from '@/components/country-flag';
import { DesignColors } from '@/constants/design-colors';
import { type ThirdPlaceTeam } from '@/services/third-place-ranking';

interface ThirdPlaceTableProps {
  teams: ThirdPlaceTeam[];
  onReorder?: (teamId: string, direction: 'up' | 'down') => void;
  editable?: boolean;
}

// Check if two teams have identical stats (everything except FIFA ranking)
const areTeamsTied = (team1: ThirdPlaceTeam, team2: ThirdPlaceTeam): boolean => {
  return (
    team1.points === team2.points &&
    team1.goalDifference === team2.goalDifference &&
    team1.goalsFor === team2.goalsFor &&
    team1.goalsAgainst === team2.goalsAgainst &&
    team1.won === team2.won &&
    team1.drawn === team2.drawn &&
    team1.lost === team2.lost &&
    team1.played === team2.played
  );
};

// Group teams by their stats to identify tied teams
const groupTiedTeams = (teams: ThirdPlaceTeam[]): ThirdPlaceTeam[][] => {
  const groups: ThirdPlaceTeam[][] = [];
  const used = new Set<string>();
  
  teams.forEach((team) => {
    if (used.has(team.teamId)) return;
    
    const tiedGroup = [team];
    teams.forEach((otherTeam) => {
      if (otherTeam.teamId !== team.teamId && !used.has(otherTeam.teamId) && areTeamsTied(team, otherTeam)) {
        tiedGroup.push(otherTeam);
        used.add(otherTeam.teamId);
      }
    });
    
    if (tiedGroup.length > 1) {
      groups.push(tiedGroup);
    }
    used.add(team.teamId);
  });
  
  return groups;
};

export function ThirdPlaceTable({ teams, onReorder, editable = false }: ThirdPlaceTableProps) {
  const tiedGroups = groupTiedTeams(teams);
  
  return (
    <View style={styles.tableContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={true}>
        <View>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            {editable && <Text style={[styles.headerCell, styles.orderCell]}>Order</Text>}
            <Text style={[styles.headerCell, styles.rankCell]}>Rank</Text>
            <Text style={[styles.headerCell, styles.teamCell]}>Team</Text>
            <Text style={[styles.headerCell, styles.groupCell]}>Group</Text>
            <Text style={[styles.headerCell, styles.statsCell]}>W</Text>
            <Text style={[styles.headerCell, styles.statsCell]}>D</Text>
            <Text style={[styles.headerCell, styles.statsCell]}>L</Text>
            <Text style={[styles.headerCell, styles.goalsCell]}>GF</Text>
            <Text style={[styles.headerCell, styles.goalsCell]}>GA</Text>
            <Text style={[styles.headerCell, styles.goalsCell]}>GD</Text>
            <Text style={[styles.headerCell, styles.pointsCell]}>Pts</Text>
          </View>

          {/* Table Rows */}
          {teams.map((team, index) => {
            // Check if this team is part of a tied group
            const tiedGroup = tiedGroups.find(group => group.some(t => t.teamId === team.teamId));
            const isTied = tiedGroup && tiedGroup.length > 1;
            // Can move up if tied with team above
            const canMoveUp = editable && isTied && index > 0 && areTeamsTied(team, teams[index - 1]);
            // Can move down if tied with team below
            const canMoveDown = editable && isTied && index < teams.length - 1 && areTeamsTied(team, teams[index + 1]);
            
            return (
              <View key={team.teamId} style={[styles.tableRow, isTied && editable && styles.tiedRow]}>
                {editable && (
                  <View style={styles.orderCell}>
                    {canMoveUp && (
                      <TouchableOpacity
                        style={styles.orderButton}
                        onPress={() => onReorder?.(team.teamId, 'up')}
                      >
                        <Text style={styles.orderButtonText}>↑</Text>
                      </TouchableOpacity>
                    )}
                    {canMoveDown && (
                      <TouchableOpacity
                        style={styles.orderButton}
                        onPress={() => onReorder?.(team.teamId, 'down')}
                      >
                        <Text style={styles.orderButtonText}>↓</Text>
                      </TouchableOpacity>
                    )}
                    {!canMoveUp && !canMoveDown && isTied && (
                      <View style={styles.orderButtonPlaceholder} />
                    )}
                  </View>
                )}
                <Text style={[styles.cell, styles.rankCell]}>{index + 1}</Text>
                <View style={[styles.cell, styles.teamCell]}>
                  <CountryFlag
                    countryCode={team.teamCode}
                    countryName={team.teamName}
                    flagSize={24}
                    showName={false}
                  />
                  <Text style={styles.teamName} numberOfLines={1} ellipsizeMode="tail">
                    {team.teamName}
                  </Text>
                </View>
                <Text style={[styles.cell, styles.groupCell]}>{team.groupName}</Text>
                <Text style={[styles.cell, styles.statsCell]}>{team.won}</Text>
                <Text style={[styles.cell, styles.statsCell]}>{team.drawn}</Text>
                <Text style={[styles.cell, styles.statsCell]}>{team.lost}</Text>
                <Text style={[styles.cell, styles.goalsCell]}>{team.goalsFor}</Text>
                <Text style={[styles.cell, styles.goalsCell]}>{team.goalsAgainst}</Text>
                <Text style={[styles.cell, styles.goalsCell]}>
                  {team.goalDifference > 0 ? '+' : ''}{team.goalDifference}
                </Text>
                <Text style={[styles.cell, styles.pointsCell, styles.pointsText]}>
                  {team.points}
                </Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
      
      {teams.length > 8 && (
        <View style={styles.noteContainer}>
          <Text style={styles.noteText}>
            Note: Only the top 8 teams will advance to Round of 32
          </Text>
        </View>
      )}
      
      {tiedGroups.length > 0 && editable && (
        <View style={styles.noteContainer}>
          <Text style={styles.noteText}>
            Teams with identical stats (highlighted) can be manually reordered. FIFA ranking will be used as the final tiebreaker if not manually ordered.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  tableContainer: {
    borderRadius: 18,
    backgroundColor: DesignColors.surface,
    overflow: 'hidden',
    marginBottom: 16,
    maxHeight: 500,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: DesignColors.text,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 2,
    borderBottomColor: DesignColors.primary,
    minWidth: 700, // Minimum width to ensure all columns are visible
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(71, 74, 74, 0.1)',
    alignItems: 'center',
    minWidth: 700, // Match header width
  },
  tiedRow: {
    backgroundColor: 'rgba(255, 193, 7, 0.1)', // Light yellow background for tied teams
  },
  headerCell: {
    color: DesignColors.textOnDark,
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
  },
  cell: {
    color: DesignColors.text,
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  rankCell: {
    width: 45,
  },
  teamCell: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingLeft: 4,
    minWidth: 140,
  },
  teamName: {
    color: DesignColors.text,
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  groupCell: {
    width: 50,
  },
  statsCell: {
    width: 30,
  },
  goalsCell: {
    width: 50,
  },
  pointsCell: {
    width: 45,
  },
  pointsText: {
    fontWeight: '700',
    color: DesignColors.primary,
  },
  orderCell: {
    width: 60,
    flexDirection: 'row',
    gap: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderButton: {
    backgroundColor: DesignColors.primary,
    borderRadius: 6,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  orderButtonText: {
    color: DesignColors.textOnDark,
    fontSize: 18,
    fontWeight: '700',
  },
  orderButtonPlaceholder: {
    width: 32,
    height: 32,
  },
  noteContainer: {
    padding: 12,
    backgroundColor: 'rgba(71, 74, 74, 0.05)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(71, 74, 74, 0.1)',
  },
  noteText: {
    color: DesignColors.text,
    fontSize: 11,
    opacity: 0.7,
    fontStyle: 'italic',
  },
});
